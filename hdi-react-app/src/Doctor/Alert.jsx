import React from "react";

function AlertSuccess(){
    return(
        <>
        <div class="alert alert-success" role="alert">
            A simple success alert—check it out!
        </div>
        </>
    );
}

function AlertWarning(){
    return(
        <>
       <div class="alert alert-warning" role="alert">
            A simple warning alert—check it out!
        </div>
        </>
    );
}

function AlertDanger(){
    return(
        <>
        <div class="alert alert-danger" role="alert">
             A simple danger alert—check it out!
        </div>
        </>
    );
}

export {
    AlertSuccess,
    AlertWarning,
    AlertDanger
};