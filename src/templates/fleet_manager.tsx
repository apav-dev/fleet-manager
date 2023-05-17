import * as React from "react";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
  TransformProps,
  TemplateProps,
} from "@yext/pages";
import Main from "../layouts/Main";
import Form from "../components/FleetForm";
import FleetIcon from "../icons/FleetIcon";
import FleetDeploy from "../components/FleetDeploy";
import useHash from "../hooks/useHash";
import { useEffect, useState } from "react";
import TransitionContainer from "../components/TransitionContainer";
import { fetchSubAccounts } from "../utils/api";
import Chat from "../components/Chat";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Yext Fleet Manager",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

export const transformProps: TransformProps<TemplateProps> = async (data) => {
  const subAccountsResponse = await fetchSubAccounts();
  const subAccounts = subAccountsResponse.response.docs[0].c_subAccounts;
  return {
    ...data,
    document: { ...data.document, subAccounts },
  };
};

type Screen = "select-flow" | "chat" | "select-account" | "deploying";

const FleetManager: Template<TemplateRenderProps> = ({
  document,
}: TemplateRenderProps) => {
  const subAccounts = document.subAccounts;

  const hash = useHash();

  const [screenType, setScreenType] = useState<Screen>("select-flow");

  useEffect(() => {
    if (hash === "#select-flow" && screenType !== "select-flow") {
      setScreenType("select-flow");
      // remove hash from url
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#deploying" && screenType !== "deploying") {
      setScreenType("deploying");
      // remove hash from url
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#select-account" && screenType !== "select-account") {
      setScreenType("select-account");
      // remove hash from url
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#chat" && screenType !== "chat") {
      setScreenType("chat");
      // remove hash from url
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [hash]);

  return (
    <Main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <FleetIcon />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Yext Fleet Manager
        </h2>
      </div>
      <TransitionContainer show={screenType === "select-flow"}>
        <div className="mt-8 flex justify-between sm:mx-auto sm:w-full sm:max-w-md ">
          <button
            className="mt-6 w-44 h-20 border-2 rounded-md bg-white font-semibold hover:border-indigo-600"
            onClick={() => {
              window.location.hash = "chat";
            }}
          >
            Create New Account
          </button>
          <button
            className="mt-6 w-40 h-20 border-2 rounded-md bg-white font-semibold hover:border-indigo-600"
            onClick={() => {
              window.location.hash = "select-account";
            }}
          >
            Deploy Sites
          </button>
        </div>
      </TransitionContainer>
      <TransitionContainer show={screenType === "select-account"}>
        <Form subAccounts={subAccounts} />
      </TransitionContainer>
      <TransitionContainer show={screenType === "deploying"}>
        <FleetDeploy subAccounts={subAccounts} />
      </TransitionContainer>
      <TransitionContainer show={screenType === "chat"}>
        <Chat />
      </TransitionContainer>
    </Main>
  );
};

export default FleetManager;
