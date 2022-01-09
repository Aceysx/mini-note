import React from "react";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import Alert from "@mui/material/Alert";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, MessageState } from "@/models/global";

const MessageBody = ({ messageState }: { messageState: MessageState }) => {
  const { isOpen, severity, message } = messageState;
  return (
    <Snackbar
      open={isOpen}
      onClose={() => GlobalModel.dispatch.message({ isOpen: false })}
      autoHideDuration={1000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
    >
      <Alert
        onClose={() => GlobalModel.dispatch.message({ isOpen: false })}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    messageState: global.messageState
  };
})(MessageBody);
