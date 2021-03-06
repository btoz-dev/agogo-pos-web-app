import React from 'react'
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { Link } from 'react-router-dom'

import './UserCard.scss';

const UserCard = (props) => {
  return (
    <Card className="UserCard">
      <Link to={'/login/' + props.userIndex}>
        <CardImg top width="100%" src={props.userAvatar ? props.userAvatar : props.defAvatar} alt={props.userName} />
        <CardBody>
          <CardTitle className={props.colorTitle}>{props.userName ? props.userName : 'User Name'}</CardTitle>
          <CardSubtitle className={props.colorSubTitle}>{props.userRole}</CardSubtitle>
        </CardBody> 
      </Link>
    </Card>
  )
}

export default UserCard