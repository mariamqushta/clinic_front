import {React,useState} from 'react'
import Navbar from '../components/Navbar'
import Doctorcard from '../components/Doctorcard'
import doctors from '../models/doctorele'

function Home() {
      const [search, setSearch] = useState("")
      const filteredDoctors = doctors.filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Navbar />

    
      <div className="container my-3">
        <input
          type="text"
          className="form-control rounded-3"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Doctors Grid */}
      <div className="container">
            <div className="row  justify-align-content-around ">
                {filteredDoctors.map((doc) => (
                <div className="col-lg-4 col-md-6 col-sm-12" key={doc.id}>
                    <Doctorcard doctor={doc} />
                </div>
                ))}
            </div>
      </div>
    </div>
  )
}

export default Home
