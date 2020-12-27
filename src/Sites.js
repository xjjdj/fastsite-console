import React, { useState, useEffect, Fragment } from 'react'
import AddSiteForm from './forms/AddSiteForm'
import EditSiteForm from './forms/EditSiteForm'
import SiteTable from './tables/SiteTable'
import axios from './myAxios'
import Entities from './Entities'


const Sites = () => {

	const initialFormState = { id: '', name: '', heading: '', categories: [] }

	// Setting state
	const [ users, setUsers ] = useState([])
	const [ currentUser, setCurrentUser ] = useState(initialFormState)
	const [ editing, setEditing ] = useState(false)
	const [ viewing, setViewing ] = useState(false)

	useEffect(() => {
		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// CRUD operations
	const fetchData = async () => {
		const results = await axios.get('/.netlify/functions/list')
		console.log(results.data)
		setUsers(results.data)
	}

	const addUser = user => {
	
		axios.post('/.netlify/functions/add', user)
		.then((response) => {
			console.log(response)
			setUsers([ ...users, user ])
		})
		.catch((err) => {
			console.error(err)
		})		
	}

	const deleteUser = id => {

		axios.post('/.netlify/functions/delete', {id : id})
		.then((response) => {
			setUsers(users.filter(user => user.id !== id))
		})
		.catch((err) => {
			console.error(err)
		})	
	}

	const updateUser = (id, updatedUser) => {

		axios.post('/.netlify/functions/add', updatedUser)
		.then((response) => {
			setEditing(false)
			setUsers(users.map(user => (user.id === id ? updatedUser : user)))
		})
		.catch((err) => {
			console.error(err)
		})	
	}

	const editRow = user => {
		setEditing(true)
		setCurrentUser(user)
	}

	const viewContent = user => {
		setEditing(false)
		setViewing(true)
		setCurrentUser(user)
	}

	return (
		<div>
			
			{viewing ? (
				<Entities 
					viewing={viewing}
					setViewing={setViewing}
					currentSite={currentUser}
				/>
			) : (
				<Fragment>
					<div className="flex-row">
						<div className="flex-large">
							<h2>All sites</h2>
							<SiteTable users={users} editRow={editRow} deleteUser={deleteUser} viewContent={viewContent}/>
						</div>
						<div className="flex-large">
							{editing ? (
								<Fragment>
									<h2>Edit site</h2>
									<EditSiteForm
										editing={editing}
										setEditing={setEditing}
										currentUser={currentUser}
										updateUser={updateUser}
									/>
								</Fragment>
							) : (
								<Fragment>
									<h2>Add site</h2>
									<AddSiteForm addUser={addUser} />
								</Fragment>
							)}
						</div>
					</div>
				</Fragment>
			)}
		</div>
	)
}

export default Sites
