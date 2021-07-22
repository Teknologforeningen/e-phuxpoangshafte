import React, { useState } from "react";
import { Box, Button, createStyles, TextField, Theme } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles'
import * as CategoryService from "../../services/CategoryServices";
import * as CategoryAction from '../../actions/CategoryActions'
import * as AuthSelector from '../../selectors/AuthSelectors'
import { useDispatch, useSelector } from "react-redux";


const NewCategoryForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [minPoints, setMinPoints] = useState<number>(0)
  const dispatch = useDispatch()
  const token = useSelector(AuthSelector.token)
  const submit = async () => {
    try{
      const addedCategory = await CategoryService.addCategory({name, description, minPoints, token})
      setName('')
      setDescription('')
      setMinPoints(0)
      dispatch(CategoryAction.addCategory(addedCategory))
    }
    catch(e){
      console.error({error: e, message: 'Could not add new category'})
    }
  }
  return(
    <Box>
      <Box display={'flex'} flexDirection={'column'}> 
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={name}
          onChange={({ target }) => setName(target.value)}
          label={'Namn'}

        />
        <Box margin={0.5}/>
        <TextField 
          variant={'outlined'}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          label={'Beskrivning'}
        />
        <Box margin={0.5}/>
        <TextField 
          id={"standard-number"}
          type={'number'}
          variant={'outlined'}
          value={minPoints}
          onChange={({ target }) => setMinPoints(Number(target.value))}
          label={'Minimi poäng för kategorin'}
        />
        <Box>
          <Button variant={'contained'} onClick={submit}>login</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NewCategoryForm