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
// import Chat from "../components/Chat";
import AccountForm from "../components/AccountForm";
import YextLogo from "../assets/Yext_Logo.png";

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

type Screen =
  | "select-flow"
  | "chat"
  | "select-account"
  | "deploying"
  | "account-form";

const FleetManager: Template<TemplateRenderProps> = ({
  document,
}: TemplateRenderProps) => {
  const subAccounts = document.subAccounts;

  const hash = useHash();

  const [screenType, setScreenType] = useState<Screen>("select-account");

  useEffect(() => {
    if (hash === "#select-flow" && screenType !== "select-flow") {
      setScreenType("select-flow");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#deploying" && screenType !== "deploying") {
      setScreenType("deploying");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#select-account" && screenType !== "select-account") {
      setScreenType("select-account");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#chat" && screenType !== "chat") {
      setScreenType("chat");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (hash === "#account-form" && screenType !== "account-form") {
      setScreenType("account-form");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [hash]);

  return (
    <Main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <FleetIcon /> */}
        <img className="h-24 w-24 mx-auto" src={YextLogo} />
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Yext Platform Solutions
        </h1>
      </div>
      <TransitionContainer show={screenType === "select-flow"}>
        <div className="mt-8 flex justify-between space-x-6 sm:mx-auto sm:w-full sm:max-w-md ">
          <button
            className="mt-6 w-44 h-20 shadow-lg rounded-md bg-white font-semibold hover:border-indigo-600 hover:scale-105"
            onClick={() => {
              window.location.hash = "chat";
            }}
          >
            Chat
          </button>
          <button
            className="mt-6 w-44 h-20 shadow-lg rounded-md bg-white font-semibold hover:border-indigo-600 hover:scale-105"
            onClick={() => {
              window.location.hash = "select-account";
            }}
          >
            Fleet
          </button>
          <button
            className="mt-6 w-44 h-20 shadow-lg rounded-md bg-white font-semibold hover:border-indigo-600 hover:scale-105"
            onClick={() => {
              window.location.hash = "account-form";
            }}
          >
            Form
          </button>
        </div>
      </TransitionContainer>
      <TransitionContainer show={screenType === "select-account"}>
        <Form subAccounts={subAccounts} />
      </TransitionContainer>
      <TransitionContainer show={screenType === "deploying"}>
        <FleetDeploy subAccounts={subAccounts} />
      </TransitionContainer>
      {/* <TransitionContainer show={screenType === "chat"}>
        <Chat />
      </TransitionContainer> */}
      <TransitionContainer show={screenType === "account-form"}>
        <AccountForm />
      </TransitionContainer>
    </Main>
  );
};

export default FleetManager;
