/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

import axios from "axios";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import {
  fireEvent,
  getByText,
  render,
  waitForElement,
  prettyDOM,
  getAllByTestId,
  getByAltText, getByPlaceholderText, queryByText, getByTestId
} from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Application from "components/Application";

/*
  A test that renders a React Component
*/
describe("Test for Application component", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const {getByText} = render(<Application/>);
    return waitForElement(()=> getByText("Monday"))
    .then(()=> {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const {container,debug} = render(<Application/>);
    await waitForElement(() => getByText(container,"Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment,"Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Lydia Miller-Jones"}
    });


    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const monday = getAllByTestId(container, "day").find(day => getByText(day, "Monday"));
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const {container, debug} = render(<Application/>);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByTestId(appointment, "student-name-input")).toBeInTheDocument();

    fireEvent.change(getByTestId(appointment, "student-name-input"), {target: {value: "Jane Dow"}});
    expect(getByText(appointment, "Save")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Jane Dow"));

    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async() => {
    const {container, debug} = render(<Application/>);
    await waitForElement(() => getByText(container,"Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment,"Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Lydia Miller-Jones"}
    });


    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Could not book appointment."));

  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() => queryByText(appointment, "Could not cancel appointment."));
  })
})