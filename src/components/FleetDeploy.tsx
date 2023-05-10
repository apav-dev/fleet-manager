import React, { useEffect } from "react";
import Container from "./Container";
import Stat from "./Stat";
import { CgSpinner } from "react-icons/cg";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import { MdOutlineDoNotDisturb } from "react-icons/Md";
import ProgressBar from "./ProgressBar";

const timeline: { accountId: string; status: Status }[] = [
  {
    accountId: "6728502",
    status: "deploy_complete",
  },
  {
    accountId: "6728500",
    status: "rar_failure",
  },
  {
    accountId: "6728499",
    status: "deploy_complete",
  },
  {
    accountId: "6728498",
    status: "deploy_complete",
  },
  {
    accountId: "6728497",
    status: "deploy_failure",
  },
  {
    accountId: "6728496",
    status: "rar_submitted",
  },
  {
    accountId: "6728495",
    status: "rar_submitted",
  },
  {
    accountId: "6728494",
    status: "rar_submitted",
  },
  {
    accountId: "6728493",
    status: "rar_submitted",
  },
  {
    accountId: "6728492",
    status: "rar_submitted",
  },
];

type Status =
  | "rar_submitted"
  | "rar_submission_failure"
  | "rar_complete"
  | "rar_failure"
  | "deploy_failure"
  | "deploy_complete";

const FleetDeploy = () => {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const renderAccountStatusIcon = (status: Status) => {
    switch (status) {
      case "deploy_complete":
        return <AiOutlineCheckCircle className="h-8 w-8 text-green-500" />;
      case "rar_submission_failure":
      case "deploy_failure":
      case "rar_failure":
        return <AiOutlineExclamationCircle className="h-8 w-8 text-red-500" />;
      default:
        return <CgSpinner className="h-8 w-8 text-gray-400 animate-spin" />;
    }
  };

  const renderRarStatus = (status: Status) => {
    switch (status) {
      case "rar_complete":
      case "deploy_complete":
      case "deploy_failure":
        return (
          <div className="flex items-center space-x-3">
            <AiOutlineCheckCircle className="h-8 w-8 text-green-500" />
            <p className="font-medium text-gray-900">
              Resources Successfully Applied
            </p>
          </div>
        );
      case "rar_submission_failure":
      case "rar_failure":
        return (
          <div className="flex items-center space-x-3">
            <AiOutlineExclamationCircle className="h-8 w-8 text-red-500" />
            <p className="font-medium text-gray-900">
              Failed to Apply Resources to Subaccount
            </p>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-3">
            <CgSpinner className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        );
    }
  };

  const renderDeployStatusIcon = (status: Status) => {
    switch (status) {
      case "deploy_complete":
        return (
          <div className="flex items-center space-x-3">
            <AiOutlineCheckCircle className="h-8 w-8 text-green-500" />
            <p className="font-medium text-gray-900">
              Site Successfully Deployed!
            </p>
          </div>
        );
      case "deploy_failure":
        return (
          <div className="flex items-center space-x-3">
            <AiOutlineExclamationCircle className="h-8 w-8 text-red-500" />
            <p className="font-medium text-gray-900">Site Failed to Deploy</p>
          </div>
        );
      case "rar_failure":
      case "rar_submission_failure":
        return (
          <div className="flex items-center space-x-3">
            <MdOutlineDoNotDisturb className="h-8 w-8 text-gray-400" />
            <p className="font-medium text-gray-900">Deploy Cancelled</p>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-3">
            <AiOutlineCheckCircle className="h-8 w-8 text-green-500" />
            <p className="font-medium text-gray-900">
              Site Successfully Deployed!
            </p>
          </div>
        );
    }
  };

  // TODO: hyperlink to account
  return (
    <Container>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Stat
            key="successful_deploys"
            label="Successful Deploys"
            value="3/10"
          />
          <Stat key="failed_deploys" label="Failed Deploys" value="2/10" />
          <Stat key="success_%" label="Success %" value="60%" />
        </dl>
      </div>
      <div className="my-8">
        <ProgressBar progress={progress} total={100} />
      </div>
      <div className="flow-root mt-10 h-96 overflow-y-auto p-4 border rounded-lg shadow">
        <ul role="list" className="-mb-8">
          {timeline.map((event, eventIdx) => (
            <li key={event.accountId}>
              <div className="relative pb-8">
                {eventIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                      {renderAccountStatusIcon(event.status)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p
                        className={twMerge(
                          "font-medium text-gray-900",
                          event.status === "rar_submitted" && "text-gray-400"
                        )}
                      >
                        {event.accountId}
                      </p>
                    </div>
                  </div>
                </div>
                {event.status !== "rar_submitted" &&
                  event.status !== "rar_submission_failure" && (
                    <div className="ml-8 my-4 space-y-2">
                      {renderRarStatus(event.status)}
                      {renderDeployStatusIcon(event.status)}
                    </div>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default FleetDeploy;
