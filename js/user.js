import * as konstanteak from './konstanteak.js';
import 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js';  
import {API_URL } from './konstanteak.js'

export const getEpaileak = async () => {
    try {
        //await(sendOptionsRequest(`${API_URL}/user/role/epaileak`));
        const response = await fetch(`${API_URL}/user/role/epaileak`, {
            method: 'GET',
              

            //cache: 'no-cache',
            //targetAddressSpace: 'private',
            mode: 'cors',headers: {
   'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',

            },
            
        });
        if (response.ok) {
            const data = await response.json();
            const epaileak = [];
            data.forEach(epaile => {
                epaileak.push(new konstanteak.user(epaile.username, epaile.email, epaile.password, epaile.role));
                
            });
            console.log(epaileak);
            return epaileak;
        }
    } catch (err) {
        console.log(err);
    }
};

export const verifyUser = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        //await(sendOptionsRequest(`${API_URL}/user/verify`));
        const response = await fetch(`${API_URL}/user/verify`, {
         method: 'POST',
           
//cache: 'no-cache',
//targetAddressSpace: 'private',
mode: 'cors',headers: {
   'ngrok-skip-browser-warning': 'true',
   'Content-Type': 'application/json',

            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            
            console.log(data);
            return data;
        }
    } catch (err) {
        console.log(err);
    }

};

export const findUser = async () => {
    const username = document.getElementById('username').value;
    try {
        //await(sendOptionsRequest(`${API_URL}/user/find`));
        const response = await fetch(`${API_URL}/user/find`, {
         method: 'POST',

//cache: 'no-cache',
//targetAddressSpace: 'private',
mode: 'cors',headers: {
   'ngrok-skip-browser-warning': 'true',
                   'Content-Type': 'application/json',

            },
            body: JSON.stringify({ username }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (err) {
        console.log(err);
    }

};

export const getRole = async (user) => {
    let username;
    if (!user) {
    username = document.getElementById('username').value;
    }
    else{
    username = user;
    }

    try {
        ////await(sendOptionsRequest(`${API_URL}/user/role`));
        const response = await fetch(`${API_URL}/user/role`, {
         method: 'POST',

//cache: 'no-cache',
//targetAddressSpace: 'private',
mode: 'cors',headers: {
   'ngrok-skip-browser-warning': 'true',
                   'Content-Type': 'application/json',

            },
            body: JSON.stringify({ username }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (err) {
        console.log(err);
    }

};

export const createNewUser = async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = "admin";
    try {
        
        if(!username||!email||!password||!role) return false;
        //await(sendOptionsRequest(`${API_URL}/user/add`));
        const response = await fetch(`${API_URL}/user/add`, {
         method: 'POST',

//cache: 'no-cache',
//targetAddressSpace: 'private',
mode: 'cors',headers: {
   'ngrok-skip-browser-warning': 'true',
                   'Content-Type': 'application/json',

            },
            body: JSON.stringify({ username, email, password, role }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (err) {
        console.log(err);
    }

};
export async function autentifikatu(){
    const token = localStorage.getItem('token');
    if(!token){
        document.body.innerHTML = '';
        const mezua = document.createElement('h1');
        mezua.textContent = 'Ez zaude logeatuta, saioa hasi, mesedez';
        const button = document.createElement('button');
        button.textContent = 'Hasi saioa';
        button.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        mezua.appendChild(button);
        document.body.appendChild(mezua);
        return false;
    }

    const decodedToken = jwt_decode(token);
    const username = decodedToken.username;
    console.log(username);
    const baimenduta = await getRole(username);
    if(baimenduta === 'admin'){
        return username;
    }
    else{
        document.body.innerHTML = '';
        const mezua = document.createElement('h1');
        mezua.textContent = `${username}-k ez du hemen egoteko baimenik`;
        document.body.appendChild(mezua);
        return false;
    }
}


