"use client";

import { useCallback, useEffect, useState } from "react";

import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import LiveCursors from "./cursos/LiveCursors";
import CursorChat from "./cursos/Cursorchat";



const Live = () => {
const others = useOthers();
const [{ cursor }, updateMyPresence] = useMyPresence() as any;
const broadcast = useBroadcastEvent();

// track the state of the cursor (hidden, chat, reaction, reaction selector)
const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
});



// Listen to keyboard events to change the cursor state
useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "/") {
        setCursorState({
        mode: CursorMode.Chat,
        previousMessage: null,
        message: "",
        });
    } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
    } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
    }
    };

    const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
        e.preventDefault();
    }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("keydown", onKeyDown);
    };
}, [updateMyPresence]);

// Listen to mouse events to change the cursor state
const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    // if cursor is not in reaction selector mode, update the cursor position
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
    // get the cursor position in the canvas
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    // broadcast the cursor position to other users
    updateMyPresence({
        cursor: {
        x,
        y,
        },
    });
    }
}, []);

// Hide the cursor when the mouse leaves the canvas
const handlePointerLeave = useCallback(() => {
    setCursorState({
    mode: CursorMode.Hidden,
    });
    updateMyPresence({
    cursor: null,
    message: null,
    });
}, []);

// Show the cursor when the mouse enters the canvas
const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
    // get the cursor position in the canvas
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({
        cursor: {
        x,
        y,
        },
    });

    // if cursor is in reaction mode, set isPressed to true
    setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
    );
    },
    [cursorState.mode, setCursorState]
);

// hide the cursor when the mouse is up
const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
    cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
}, [cursorState.mode, setCursorState]);


return (
    <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className="h-[100vh] w-full flex justify-center items-center text-center"
    >


        {/* If cursor is in chat mode, show the chat cursor */}
        {cursor && (
        <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
        />
        )}
        {/* Show the live cursors of other users */}
        <LiveCursors others={others} />
        </div>
);
};

export default Live;