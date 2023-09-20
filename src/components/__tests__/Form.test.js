import React from "react";

import {render, cleanup, fireEvent, findByText, getByText} from "@testing-library/react";
import Form from "../Appointment/Form";

describe("test for Form component", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];


  it("renders without student name if not provided", () => {
    const {getByPlaceholderText} = render(<Form interviewers={interviewers}/>);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const {getByTestId} = render(<Form interviewers={interviewers} name="Lydia Miller-Jones"/>);
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined */
    const {getByText} = render(<Form interviewers={interviewers} interviewer={interviewers[0].id}/>)
    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer cannot be null", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the interviewer prop should be null */
    const {getByText} = render(<Form interviewers={interviewers} name="Lydia Miller-Jones" onSave={onSave}/>)
    /* 3. Click the save button */

    fireEvent.click(getByText("Save"));

    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  // it("calls onSave function when the name and interviewer is defined", () => {
  //   /* 1. Create the mock onSave function */
  //   const onSave = jest.fn();
  //
  //   /* 2. Render the Form with interviewers, name and the onSave mock function passed as an onSave prop */
  //   const {queryByText, getByText} = render(<Form name="Lydia Miller-Jones" interviewers={interviewers}
  //                                                 interviewer={interviewers[0].id} onSave={onSave}/>);
  //   /* 3. Click the save button */
  //   fireEvent.click(getByText("Save"));
  //
  //   expect(queryByText(/student name cannot be blank/i)).toBeNull();
  //   expect(queryByText(/please select an interviewer/i)).toBeNull();
  //   expect(onSave).toHaveBeenCalledTimes(1);
  //   expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  // });
  //
  // it("submit the name entered by the user", () => {
  //   const onSave = jest.fn();
  //   const {getByText, getByPlaceholderText} = render(<Form interviewers={interviewers} interviewer={1}
  //                                                          onSave={onSave}/>);
  //
  //   const input = getByPlaceholderText("Enter Student Name");
  //
  //   fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}});
  //   fireEvent.click(getByText("Save"));
  //
  //   expect(onSave).toHaveBeenCalledTimes(1);
  //   expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  // });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const {getByText, getByPlaceholderText, queryByText} = render(<Form interviewers={interviewers} interviewer={1}
                                                           onSave={onSave}/>);
    fireEvent.click(getByText('Save'));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    let input = getByPlaceholderText("Enter Student Name");
    fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}});
    fireEvent.click(getByText('Save'));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);

  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});