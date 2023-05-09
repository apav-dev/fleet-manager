import * as React from "react";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import Main from "../layouts/Main";
import Form from "../components/FleetForm";
import Heading from "../components/Heading";
import FleetIcon from "../icons/FleetIcon";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Yext Schema Builder",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const FleetManager: Template<TemplateRenderProps> = () => {
  return (
    <Main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <FleetIcon />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Yext Fleet Manager
        </h2>
      </div>
      <Form />
    </Main>
  );
};

export default FleetManager;
