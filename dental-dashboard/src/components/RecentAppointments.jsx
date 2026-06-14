function RecentAppointments() {
  return (
    <>

      <h2 className="title">
        Recent Appointments
      </h2>

      <div className="tableContainer">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Ahmed Ali</td>
              <td>02 Nov</td>
              <td>
                <span className="done">
                  Done
                </span>
              </td>
            </tr>

            <tr>
              <td>Mai Ali</td>
              <td>02 Dec</td>
              <td>
                <span className="pending">
                  Pending
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </>
  );
}

export default RecentAppointments;