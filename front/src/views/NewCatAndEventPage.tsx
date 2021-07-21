import { Box } from "@material-ui/core";
import React from "react";
import NewCatForm from "../components/Admin/NewCatForm";
import Togglable from "../components/UI/Togglable";

const NewCatAndEventPage = () => {
  return(
    <Box>
      <Togglable buttonLabelOpen={'Lägg till ny kategori'} buttonLabelClose={'Stäng kategori'}>
        <NewCatForm/>
      </Togglable>
      <Togglable buttonLabelOpen={'Lägg till nytt poäng'} buttonLabelClose={'Stäng poäng'}>
        <p></p>
      </Togglable>
    </Box>
  )
}

export default NewCatAndEventPage

//<NewEventForm/>