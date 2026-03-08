import AddIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { alpha, Box, ButtonBase, Grid2 as Grid, IconButton, Stack } from "@mui/material";

import { confirmDialogAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import useFileUpload from "@src/components/fields/File/useFileUpload";
import Thumbnail from "@src/components/Thumbnail";
import { useSetAtom } from "jotai";
import { assignIn } from "lodash-es";
import { useContext, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { deleteImgHoverSx, imgSx, thumbnailSx } from "./DisplayCell";
import { imageMimeTypes } from "./index";
import type { IEditorCellProps } from "@src/components/fields/types";
import type { FileValue } from "@src/types/table";
import type {
  DropResult } from "react-beautiful-dnd";

export default function Image_({
  column,
  value,
  disabled,
  _rowy_ref,
  tabIndex,
  rowHeight,
}: IEditorCellProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const confirm = useSetAtom(confirmDialogAtom, { store: projectScopeStore });

  const {
    loading,
    progress,
    handleDelete,
    localFiles,
    dropzoneState,
    handleUpdate,
  } = useFileUpload(_rowy_ref, column.key, {
    multiple: true,
    accept: imageMimeTypes,
  });

  const localImages = useMemo(
    () =>
      localFiles.map((file) =>
        assignIn(file, { localURL: URL.createObjectURL(file) })
      ),
    [ localFiles ]
  );

  const { getRootProps, getInputProps, isDragActive } = dropzoneState;
  const dropzoneProps = getRootProps();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    const newValue = Array.from(value);

    newValue.splice(source.index, 1);
    newValue.splice(destination.index, 0, value[source.index]);

    handleUpdate([ ...newValue ]);
  };

  let thumbnailSize = "100x100";
  if (rowHeight > 50) {
    thumbnailSize = "200x200";
  }
  if (rowHeight > 100) {
    thumbnailSize = "400x400";
  }

  return (
    <Stack
      direction="row"
      className="cell-collapse-padding"
      sx={[
        {
          py: 0,
          pl: 1,
          height: "100%",
          width: "100%",
        },
        isDragActive
          ? {
            backgroundColor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.hoverOpacity * 2
              ),

            "& .row-hover-iconButton": { color: "primary.main" },
          }
          : {},
      ]}
      alignItems="center"
      {...dropzoneProps}
      tabIndex={tabIndex}
      onClick={undefined}
    >
      <div
        style={{
          width: "calc(100% - 30px)",
          overflowX: "hidden",
          marginLeft: "0 !important",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="image-droppable" direction="horizontal">
            {(provided) => (
              <Grid
                container
                spacing={0.5}
                wrap="nowrap"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Array.isArray(value)
                && value.map((file: FileValue, i) => (
                  <Draggable
                    key={file.downloadURL}
                    draggableId={file.downloadURL}
                    index={i}
                  >
                    {(provided) => (
                      <Grid
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {value.length > 1 && (
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <DragIndicatorIcon />
                          </div>
                        )}
                        <ButtonBase
                          aria-label="Delete…"
                          sx={imgSx(rowHeight)}
                          className="img"
                          onClick={() => {
                            confirm({
                              title: "Delete image?",
                              body: "This image cannot be recovered after",
                              confirm: "Delete",
                              confirmColor: "error",
                              handleConfirm: () => handleDelete(file),
                            });
                          }}
                          disabled={disabled}
                          tabIndex={tabIndex}
                        >
                          <Thumbnail
                            imageUrl={file.downloadURL}
                            size={thumbnailSize}
                            objectFit="contain"
                            sx={thumbnailSx}
                          />
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={deleteImgHoverSx}
                          >
                            <DeleteIcon color="error" />
                          </Grid>
                        </ButtonBase>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {localImages
                && localImages.map((image) => (
                  <Grid>
                    <Box
                      sx={[
                        imgSx(rowHeight),
                        {
                          boxShadow: (theme) =>
                            `0 0 0 1px ${ theme.palette.divider } inset`,
                        },
                      ]}
                      style={{
                        backgroundImage: `url("${ image.localURL }")`,
                      }}
                    />
                  </Grid>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {!loading ? (
        !disabled && (
          <IconButton
            size="small"
            onClick={(e) => {
              dropzoneProps.onClick!(e);
              e.stopPropagation();
            }}
            style={{ display: "flex" }}
            className={_rowy_ref && "row-hover-iconButton end"}
            disabled={!_rowy_ref}
            tabIndex={tabIndex}
          >
            <AddIcon />
          </IconButton>
        )
      ) : (
        <div style={{ padding: 4 }}>
          <CircularProgressOptical
            size={24}
            variant={progress === 0 ? "indeterminate" : "determinate"}
            value={progress}
            style={{ display: "block" }}
          />
        </div>
      )}

      <input {...getInputProps()} tabIndex={tabIndex} />
    </Stack>
  );
}
