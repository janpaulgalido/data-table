function closeAlert() {
	const div = document.querySelector('.alert');
	const btn = document.querySelector('.close_btn');
	const msg = document.getElementById('msg');

	div.style.opacity = '0';
	setTimeout(function () {
		div.classList.remove('show');
		btn.classList.remove('show');
		msg.innerHTML = '';
	}, 300);
}

function openAlert(res, success) {
	const div = document.querySelector('.alert');
	const btn = document.querySelector('.close_btn');
	const msg = document.getElementById('msg');
	const color_warning = '#da8f04';

	let color = !success
		? (div.style.backgroundColor = color_warning)
		: (div.style.backgroundColor = null);

	if (!div.classList.contains('show') && !btn.classList.contains('show')) {
		setTimeout(() => {
			color;
			msg.innerHTML = res;
			div.classList.add('show');
			btn.classList.add('show');
			div.style.opacity = null;
			setTimeout(() => closeAlert(), 5000);
		}, 250);
	} else {
		msg.innerHTML = res;
		color;
	}
}

function getData() {
	const tbody = document.querySelector('#tbody');
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'action.php', true);

	xhr.onload = function () {
		if (this.status == 200) {
			let users = JSON.parse(this.responseText);

			let output = '';
			const options = {
				weekday: 'short',
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};

			for (let i in users) {
				const date = new Date(users[i].created_at);

				const mydate = date.toLocaleString('en-PH', options);

				output +=
					'<tr>' +
					'<td>' +
					users[i].id +
					'</td>' +
					'<td>' +
					users[i].name.charAt(0).toUpperCase() +
					users[i].name.slice(1) +
					'</td>' +
					'<td>' +
					users[i].country +
					'</td>' +
					'<td>' +
					users[i].gender +
					'</td>' +
					'<td>' +
					mydate +
					'</td>' +
					'<td>' +
					"<form class='updateForm' method='POST'>" +
					"<input class='update_hidden' type='hidden' data-id='" +
					users[i].id +
					"' name='_method' value='PUT'/>" +
					"<button class='btn table_btn btn_success' type='submit' title='Update this row'><i class='fas fa-user-edit'></i></button>" +
					'</form>' +
					'</td>' +
					'<td>' +
					"<form class='deleteForm' method='POST'>" +
					"<input class='delete_hidden' type='hidden' data-id='" +
					users[i].id +
					"' name='_method' value='DELETE'/>" +
					"<button class='btn table_btn btn_danger' type='submit' title='Delete this row'><i class='fas fa-trash-alt'></i></button>" +
					'</form>' +
					'</td>' +
					'</tr>';
			}

			tbody.innerHTML = output;
		} else if (this.status == 204) {
			tbody.innerHTML = '<h3>0 results</h3>';
		}

		deleteData();
		editData();
	};
	xhr.send();
}

function postData(e) {
	e.preventDefault();
	const name = document.getElementById('name').value;
	const country = document.getElementById('country').value;
	const gender = document.getElementById('gender').value;
	const id = document.getElementById('hidden').value;
	console.log(id);
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = function () {
		const response = xhr.responseText;
		if (xhr.readyState == 4 && xhr.status == 200) {
			let success = false;
			if (this.responseText === 'error') {
				let msg = 'Please fill in all the fields!';
				console.error(msg);
				openAlert(msg, success);
			} else {
				success = true;
				openAlert(this.responseText, success);
			}
			getData();
			document.querySelector('.user_form').reset();
		} else {
			console.error(response);
		}
	};

	const params = {
		id,
		name,
		country,
		gender,
	};
	const data = JSON.stringify(params);
	xhr.send(data);
}

function editData() {
	const name = document.getElementById('name');
	const country = document.getElementById('country');
	const gender = document.getElementById('gender');
	const id_input = document.getElementById('hidden');

	let x = document.querySelectorAll('.updateForm');
	let y = document.querySelectorAll('.update_hidden');

	for (let i = 0; i < x.length; i++) {
		x[i].addEventListener('submit', function (e) {
			e.preventDefault();
			let id = y[i].getAttribute('data-id');

			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'edit.php', true);

			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					let response = JSON.parse(xhr.responseText);

					console.log(response);

					name.value = response.name;
					country.value = response.country;
					gender.value = response.gender;
					id_input.value = response.id;
				} else {
					openAlert(xhr.responseText, false);
					console.error(xhr.responseText);
				}
			};

			const data = {
				id: id,
			};
			const jsondata = JSON.stringify(data);
			xhr.send(jsondata);
		});
	}
}

function deleteData(e) {
	let x = document.querySelectorAll('.deleteForm');
	let y = document.querySelectorAll('.delete_hidden');

	for (let i = 0; i < x.length; i++) {
		x[i].addEventListener('submit', function (e) {
			e.preventDefault();
			let id = y[i].getAttribute('data-id');

			const xhr = new XMLHttpRequest();
			xhr.open('DELETE', 'action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			const mydata = { id: id };
			const data = JSON.stringify(mydata);

			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log(xhr.responseText);
					openAlert(xhr.responseText, true);
					getData();
				} else {
					console.log(xhr.responseText);
				}
			};
			xhr.send(data);
		});
	}
}
