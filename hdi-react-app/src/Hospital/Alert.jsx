import React from "react";

function AlertSuccess() {
  return (
    <>
      <div class="alert alert-success" role="alert">
        A simple success alert—check it out!
      </div>
    </>
  );
}

function RequestSent() {
  return (
    <>
      <div style={{position:"fixed",zIndex:"10",width:"100vw"}} class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Request sent suceessfully</strong>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </>
  );
}

function AlertWarning() {
  return (
    <>
      <div class="alert alert-warning" role="alert">
        A simple warning alert—check it out!
      </div>
    </>
  );
}

function AlertDanger() {
  return (
    <>
      <div class="alert alert-danger" role="alert">
        A simple danger alert—check it out!
      </div>
    </>
  );
}

export { AlertSuccess, AlertWarning, AlertDanger, RequestSent };
