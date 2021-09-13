import React from 'react'

const ParagraphedListItem = ({index, content}) =>{
    const classes = useStyle()
    return(
        <ListItem  key={index}>  
           ${index}. <ListItemText>{content}</ListItemText>        
        </ListItem>
    )
}

export default ParagraphedListItem