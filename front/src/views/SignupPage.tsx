import { Box, Button, Checkbox, createStyles, FormControlLabel, FormGroup, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const SignupPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [capWithTF, setCapWithTF] = useState<boolean>(true)
  const dispatch = useDispatch();
  //const history = useHistory();
  const classes = useStyles()

  const submit = () => {}
  return(
  <Box>
    <Box display={'flex'} flexDirection={'column'} className={classes.container}>
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={'Email'}
          InputLabelProps={{classes: {
            root: classes.redLabel
          }}}
        />
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={password}
          type={'password'}
          onChange={({ target }) => setPassword(target.value)}
          label={'Password'}
          InputLabelProps={{classes: {
            root: classes.redLabel
          }}}
        />
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
          label={'Förnamn'}
          InputLabelProps={{classes: {
            root: classes.redLabel
          }}}
        />
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
          label={'Efternamn'}
          InputLabelProps={{classes: {
            root: classes.redLabel
          }}}
        />
        <Box margin={0.5}/>
        <InputLabel id='fieldOfStudy'>Studie inriktning</InputLabel>
        <Select 
        variant={'outlined'}
        value={fieldOfStudy}
        onChange={({ target }) => setFieldOfStudy(target.value as string)}
        label={'Efternamn'}
        labelId={fieldOfStudy}
        defaultValue = {'Studie inriktning'}>
          <MenuItem value={'Teknisk fysik och matematik'}>Teknisk fysik och matematik</MenuItem>
          <MenuItem value={'Informations nätverk'}>Informations nätverk</MenuItem>
          <MenuItem value={'Maskin och byggnadsteknik'}>Maskin och byggnadsteknik</MenuItem>
        </Select>
        <Box margin={0.5}/>
        <FormGroup row>
          <FormControlLabel
          control= {
            <Checkbox
            checked={capWithTF}
            onChange={({target}) => setCapWithTF(target.checked)}
            color = 'secondary'
            inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
          label='Jag avlägger min phuxfostran vid TF'
          labelPlacement='start'
          />
        </FormGroup>

    </Box>
        <Box>
      <Button variant={'contained'} className = {classes.redLabel} onClick={submit}>login</Button>
      </Box>
  </Box>)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    maxWidth: 300,
  },
  redLabel: {
    color: theme.palette.secondary.main
  }
}))

export default SignupPage