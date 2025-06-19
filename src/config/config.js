import moment from 'moment';

export const API_URL = 'https://etracker-software-api.onrender.com/api/v1';
// export const API_URL = 'http://localhost:8800/api/v1';

export const USER_TOKEN = 'sampleToken';


export const getToken = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token;
};


export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = "/signin";
}


// get user
export const getUser = () => {
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const userData = JSON.parse(user);
  return userData;
};

export const getFormattedDate = (date) => {
    return moment(date).format('MMMM Do YYYY');
};

export function calPercentage(num, percentage) {
    const result = num * (percentage / 100);
    return parseFloat(result.toFixed(2));
}

export const formatMoney = (amount) => {
    const money = Number(amount) || 0;
    return '₦ ' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
