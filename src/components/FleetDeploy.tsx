import React, { useEffect, useState } from "react";
import Container from "./Container";
import Stat from "./Stat";
import { CgSpinner } from "react-icons/cg";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { FaBan } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import ProgressBar from "./ProgressBar";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "./Skeleton";

type DeployStatus =
  | "rar_submitted"
  | "rar_submission_failure"
  | "rar_complete"
  | "rar_failure"
  | "deploy_failure"
  | "deploy_complete";

const fetchFleetStatuses = async (): Promise<
  {
    accountId: string;
    status: DeployStatus;
  }[]
> => {
  const response = await fetch(`/api/deploys`);
  return response.json();
};

const FleetDeploy = () => {
  const [totalDeploys, setTotalDeploys] = useState(0);
  const [deployProgress, setDeployProgress] = useState(0);
  const [successfulDeploys, setSuccessfulDeploys] = useState(0);
  const [failedDeploys, setFailedDeploys] = useState(0);
  const [accounts, setAccounts] = useState<Record<string, DeployStatus>>({});
  const [complete, setComplete] = useState(false);
  const [successPercent, setSuccessPercent] = useState("0%");

  const { data } = useQuery({
    queryKey: ["accountStatuses"],
    queryFn: fetchFleetStatuses,
    refetchInterval: 1000,
    enabled: !complete,
    onSuccess: () => {
      calculateProgress();
    },
  });

  useEffect(() => {
    if (data) {
      // if the length of the data array is greater than the length of the accounts array (meaning there are new accounts) then set the accounts array to the data array
      if (data?.length > Object.keys(accounts).length) {
        const newAccounts = data.reduce((acc, curr) => {
          return { ...acc, [curr.accountId]: curr.status };
        }, {});
        setAccounts(newAccounts);
      } else {
        // for each account in data, check if the status has changed. If it has, update the accounts object
        const newAccountStatuses = data.reduce((acc, curr) => {
          if (accounts[curr.accountId] !== curr.status) {
            return { ...acc, [curr.accountId]: curr.status };
          }
          return acc;
        }, {});
        setAccounts({ ...accounts, ...newAccountStatuses });
      }
    }
  }, [data]);

  useEffect(() => {
    if (totalDeploys > 0 && deployProgress === totalDeploys) {
      setComplete(true);
    }
  }, [deployProgress]);

  const calculateProgress = () => {
    setTotalDeploys(data?.length || 0);
    let progress = 0;
    let successes = 0;
    let failures = 0;
    data?.forEach((event) => {
      if (event.status === "deploy_complete") {
        successes++;
        progress++;
      } else if (
        event.status === "deploy_failure" ||
        event.status === "rar_failure" ||
        event.status === "rar_submission_failure"
      ) {
        failures++;
        progress++;
      }
      setSuccessPercent(`${Math.floor((successes / totalDeploys) * 100)}%`);
    });

    setDeployProgress(progress);
    setSuccessfulDeploys(successes);
    setFailedDeploys(failures);
  };

  const renderAccountStatusIcon = (status: DeployStatus) => {
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

  const renderRarStatus = (status: DeployStatus) => {
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

  const renderDeployStatusIcon = (status: DeployStatus) => {
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
            <FaBan className="h-8 w-8 text-gray-400" />
            <p className="font-medium text-gray-900">Deploy Cancelled</p>
          </div>
        );
      case "rar_complete":
        return (
          <div className="flex items-center space-x-3">
            <CgSpinner className="h-8 w-8 text-gray-400 animate-spin" />
            <p className="font-medium text-gray-900">Deploying Site...</p>
          </div>
        );
      default:
        return <></>;
    }
  };

  // TODO: hyperlink to account
  return (
    <Container>
      {totalDeploys > 0 ? (
        <>
          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Stat
                key="successful_deploys"
                label="Successful Deploys"
                value={`${successfulDeploys}/${totalDeploys}`}
              />
              <Stat
                key="failed_deploys"
                label="Failed Deploys"
                value={`${failedDeploys}/${totalDeploys}`}
              />
              {/* TODO: Update */}
              <Stat key="success_%" label="Success %" value={successPercent} />
            </dl>
          </div>
          <div className="my-8">
            <ProgressBar progress={deployProgress} total={data?.length || 0} />
          </div>
          <div className="flow-root mt-10 h-96 overflow-y-auto p-4 border rounded-lg shadow">
            <ul role="list" className="-mb-8">
              {Object.entries(accounts).map(([accountId, status], eventIdx) => (
                <li key={accountId}>
                  <div className="relative pb-8">
                    {eventIdx !== Object.entries(accounts).length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                          {renderAccountStatusIcon(status)}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p
                            className={twMerge(
                              "font-medium text-gray-900",
                              status === "rar_submitted" && "text-gray-400"
                            )}
                          >
                            {accountId}
                          </p>
                        </div>
                      </div>
                    </div>
                    {status !== "rar_submitted" &&
                      status !== "rar_submission_failure" && (
                        <div className="ml-8 my-4 space-y-2">
                          {renderRarStatus(status)}
                          {renderDeployStatusIcon(status)}
                        </div>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Skeleton />
      )}
    </Container>
  );
};

export default FleetDeploy;
