import React, { Suspense } from "react";
import { useState } from "react";
import type { Message } from "@yext/chat-core";
import cx from "classnames";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
// TODO: Remove and replace with @yext/react-components Markdown component
import NoSsr from "@mui/base/NoSsr";
// Import reactmarkdown lazily
const ReactMarkdown = React.lazy(() => import("react-markdown"));

const formatUglyServerTimestamp = (timestamp: number | string) => {
  if (typeof timestamp === "string") {
    timestamp = parseInt(timestamp);
  }
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const SPLIT_CHAR = "ℹ";

export default function MessageBubble({
  message,
  index,
}: {
  message: Message;
  index: number;
}) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [thumbStatus, setThumbStatus] = useState<"UP" | "DOWN" | undefined>(
    undefined
  );

  let messageText = message.text;
  let explanation: string | undefined = undefined;
  if (message.text.includes(SPLIT_CHAR)) {
    [messageText, explanation] = message.text.split(SPLIT_CHAR);
  }

  return (
    <Transition
      show={true}
      appear={true}
      enter="transition-opacity duration-400"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className={cx("flex flex-col gap-y-2 w-full")}
    >
      <div
        className={cx(
          "flex gap-x-2",
          message.source === "BOT" ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div
          onMouseEnter={() => setShowTimestamp(true)}
          onMouseLeave={() => setShowTimestamp(false)}
          className={cx(
            "p-4 rounded-2xl w-fit max-w-lg relative",
            message.source === "BOT"
              ? "text-left bg-gray-100"
              : "text-right bg-blue-700 relative"
          )}
        >
          <Transition
            show={showTimestamp && message.source === "BOT" && index !== 0}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-1"
            className="absolute -top-4 -right-4 bg-white border border-gray-200 p-1 rounded-full flex flex-row gap-x-1"
          >
            <button
              onClick={() => setThumbStatus("UP")}
              className={cx(
                "rounded-full",
                thumbStatus === "UP"
                  ? "bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              )}
            >
              <HandThumbUpIcon className="w-4 h-4 p-1" />
            </button>
            <button
              onClick={() => setThumbStatus("DOWN")}
              className={cx(
                "rounded-full",
                thumbStatus === "DOWN"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-100 bg-white text-gray-700"
              )}
            >
              <HandThumbDownIcon className="w-4 h-4 p-1" />
            </button>
          </Transition>
          {/* TODO: Update when @yext/react-components are working */}
          {/* <div
            className={cx(
              "prose overflow-x-auto",
              message.source === "BOT" ? "text-gray-900" : "text-white"
            )}
          >
            {/* <Markdown content={messageText} /> */}
          {/* </div>  */}
          <div
            className={cx(
              "prose overflow-x-auto",
              message.source === "BOT" ? "text-gray-900" : "text-white"
            )}
          >
            <NoSsr>
              <Suspense fallback="">
                <ReactMarkdown>{messageText}</ReactMarkdown>
              </Suspense>
            </NoSsr>
          </div>
          {explanation && (
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300">
              {explanation}
            </div>
          )}
        </div>
        <Transition
          show={showTimestamp}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-1"
          className={cx(
            "text-gray-400 text-sm my-auto shrink-0",
            message.source === "BOT" ? "text-left" : "ml-auto text-right"
          )}
        >
          {formatUglyServerTimestamp(message.timestamp)}
        </Transition>
      </div>
    </Transition>
  );
}
