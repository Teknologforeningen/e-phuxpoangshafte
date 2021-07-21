import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const SuccessfulsignupPage = () => {
  const history = useHistory()

  setTimeout(() => {
    history.push('/')
  }, 10*1000)

  return(
    <Box>
      <Typography>
        Grattis, anvädaren har lagts till. Du kan nu logga in och börja använda phuxpoängskortet!
      </Typography>
      <br/>
      <Typography>
        Du kommer att flyttas vidare om 10 sekunder.
      </Typography>
    </Box>
  )
}

export default SuccessfulsignupPage