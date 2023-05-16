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

const FleetManager: Template<TemplateRenderProps> = ({
  document,
}: TemplateRenderProps) => {
  const subAccounts = document.subAccounts;

  const hash = useHash();

  const [showDeploy, setShowDeploy] = useState(false);

  useEffect(() => {
    if (hash === "#deploying" && !showDeploy) {
      setShowDeploy(true);
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
      {!showDeploy && <Form subAccounts={subAccounts} />}
      <TransitionContainer show={showDeploy}>
        <FleetDeploy subAccounts={subAccounts} />
      </TransitionContainer>
    </Main>
  );
};

export default FleetManager;
