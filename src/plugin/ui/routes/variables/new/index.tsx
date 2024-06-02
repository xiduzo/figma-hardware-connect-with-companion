import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components";
import { useSetWindowSize } from "../../../hooks";
import { CreateVariable } from "../../../types";
import { sendMessageToFigma } from "../../../utils";

import {
  VariableForm,
  type VariableFormData,
} from "../components/VariableForm";

export default function Page() {
  useSetWindowSize({ width: 240, height: 260 });
  const navigate = useNavigate();

  function handleValid(data: VariableFormData) {
    sendMessageToFigma(CreateVariable(data));
    navigate(-1);
  }

  return (
    <>
      <Header title="Create variable"></Header>
      <VariableForm
        onValid={handleValid}
        onInvalid={console.log}
        defaultValues={{
          resolvedType: "STRING",
        }}
      />
    </>
  );
}
