import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as UserService from '../services/UserServices';
import { NewUser } from '../types';

const SignupPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [capWithTF, setCapWithTF] = useState<boolean>(true);
  const history = useHistory();

  const submit = async () => {
    try {
      console.log('Submit initiated');
      const userInfo: NewUser = {
        email,
        password,
        firstName,
        lastName,
        fieldOfStudy,
        capWithTF,
      };
      const response = await UserService.addUser(userInfo);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setFieldOfStudy('');
      setCapWithTF(true);
      history.push('/successfulsignup');
      return response;
    } catch (e) {
      console.error({ message: 'Could not add new user', error: e });
    }
  };

  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'}>
        <Box margin={0.5} />
        <TextField
          variant={'outlined'}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={'Email'}
        />
        <Box margin={0.5} />
        <TextField
          variant={'outlined'}
          value={password}
          type={'password'}
          onChange={({ target }) => setPassword(target.value)}
          label={'Password'}
        />
        <Box margin={0.5} />
        <TextField
          variant={'outlined'}
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
          label={'Förnamn'}
        />
        <Box margin={0.5} />
        <TextField
          variant={'outlined'}
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
          label={'Efternamn'}
        />
        <Box margin={0.5} />
        <InputLabel id="fieldOfStudy">Studie inriktning</InputLabel>
        <Select
          variant={'outlined'}
          value={fieldOfStudy}
          onChange={({ target }) => setFieldOfStudy(target.value as string)}
          label={'Efternamn'}
          labelId={fieldOfStudy}
          defaultValue={'Studie inriktning'}
        >
          <MenuItem value={'Teknisk fysik och matematik'}>
            Teknisk fysik och matematik
          </MenuItem>
          <MenuItem value={'Informations nätverk'}>
            Informations nätverk
          </MenuItem>
          <MenuItem value={'Maskin och byggnadsteknik'}>
            Maskin och byggnadsteknik
          </MenuItem>
        </Select>
        <Box margin={0.5} />
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={capWithTF}
                onChange={({ target }) => setCapWithTF(target.checked)}
                color="secondary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Jag avlägger min phuxfostran vid TF"
            labelPlacement="start"
          />
        </FormGroup>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={submit}>
          login
        </Button>
      </Box>
    </Box>
  );
};

export default SignupPage;
