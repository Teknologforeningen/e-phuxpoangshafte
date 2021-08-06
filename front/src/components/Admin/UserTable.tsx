import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import * as UserService from '../../services/UserServices'
import * as AuthSelector from '../../selectors/AuthSelectors'
import * as EventService from '../../services/EventServices'
import { authDetails, DoneEvent, Event, EventStatus, userRole } from '../../types';
import { DataGrid, GridColDef, GridRowsProp } from '@material-ui/data-grid';


const UserTable = () => {
  const token = useSelector(AuthSelector.token)
  const [events, setEvents] = useState<Event[]|undefined>()
  const [users, setUsers] = useState<authDetails[]|undefined>()
  useEffect( () => {
    const getEvents = async () => {
      const response = await EventService.getAllEvents()
      setEvents(response)
    } 
    const getUsers = async () => {
      const response = await UserService.getAllUsers(token)
      setUsers(response)
    }  
    getEvents()
    getUsers()
  }, [token])

  const columns: GridColDef[] = events 
   ? events.map( (event: Event) => {
      return {
        field: 'col' + event.id,
        headerName: event.name,
        description: event.description,
        width: 150
      }
    })
  : [{field: '',
    headerName: ''
  }]

  const usersNoAdmins = users 
  ? users.filter((user: authDetails) => user.role !== userRole.ADMIN )
  : undefined

  const rows: GridRowsProp = usersNoAdmins && events
  ?usersNoAdmins.map( (user: authDetails) => {
    const userCompletedEventStatuses: {[eventId: string]: EventStatus | 'NOSTATUS'} = events.reduce((map, event) => {
      return {...map,
      ['col' +event.id]: user.events.find((de: DoneEvent) => de.eventID === event.id)?.status || 'NOSTATUS'}
      }, {} as {[eventId: number]: EventStatus | 'NOSTATUS'});
    return ({
      id: user.id,
      name: user.firstName + " " + user.lastName,
      ...userCompletedEventStatuses
    })
  })
  : [{
    id: 0
  }]

  const nameColumn: GridColDef = {
    field: 'name',
    headerName: 'Namn',
    description: 'Användarens hela namn',
    width: 150
  }

  const extraCol: GridColDef = {
    field: 'col11',
    headerName: 'col11',
    width: 150
  }
  const extraRow = {
     id: 5,
     col11: 'Hello'
  }

  const columnsWithNames = [nameColumn,...columns, ]
  console.table(rows)
  console.table(columnsWithNames)

  return(
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>

          <DataGrid
            rows={[...rows, extraRow]}
            columns={columnsWithNames}/>
        </div>
      </div>
  )
}

export default UserTable
