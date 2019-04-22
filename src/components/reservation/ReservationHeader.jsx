import React from 'react'
import { NavLink } from 'reactstrap';

const ReservationHeader = (props) => {
  return (
    <thead>
      <tr>
        <th className="header reservation-id">Transaksi</th>
        <th className="header reservation-date text-left">Tanggal</th>
      </tr>
    </thead>
  )
}

export default ReservationHeader