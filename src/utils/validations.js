import validator from 'is_js';
import strings from '../constants/lang';
const checkEmpty = (val, key) => {
  if (validator.empty(val.trim())) {
    return `Please Enter ${key}`;
  } else {
    return '';
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `Please enter valid ${key}`;
  } else {
    return '';
  }
};

export default function (data) {
  let error = '';
  const {
    username,
    email,
    name,
    password,
    phoneNumber,
    newPassword,
    confirmPassword,
    message,
    otp,
    address,
    street,
    city,
    pincode,
    states,
    country,
  } = data;
  console.log(message, 'message');
  if (username !== undefined) {
    let emptyValidationText = checkEmpty(username, 'Name');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(username, 3, 'Name');
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (name !== undefined) {
    let emptyValidationText = checkEmpty(name, 'Name');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 3, 'Name');
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (address !== undefined) {
    let emptyValidationText = checkEmpty(address, strings.ENTER_NEW_ADDRESS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (street !== undefined) {
    let emptyValidationText = checkEmpty(street, strings.ENTER_STREET);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (city !== undefined) {
    console.log(city, 'city>>>>>>>>>>>');
    let emptyValidationText = checkEmpty(city, strings.CITY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (states !== undefined) {
    let emptyValidationText = checkEmpty(states, strings.STATE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (country !== undefined) {
    let emptyValidationText = checkEmpty(country, strings.COUNTRY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (pincode !== undefined) {
    let emptyValidationText = checkEmpty(pincode, strings.PINCODE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if (lastName !== undefined) {
  // 	let emptyValidationText = checkEmpty(lastName, 'last name');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		let minLengthValidation = checkMinLength(lastName, 3, 'Last name');
  // 		if (minLengthValidation !== '') {
  // 			return minLengthValidation;
  // 		}
  // 	}
  // // }

  // if (date !== undefined) {
  // 	let emptyValidationText = checkEmpty(date, 'date');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		if (validator.date(date)) {
  // 			ToastAndroid.showWithGravityAndOffset(`please Valid ${date}`,
  //   ToastAndroid.LONG,
  //   ToastAndroid.TOP,
  //   0,
  //   100
  //   )
  // 			return 'Please enter valid email';
  // 		}
  // 	}
  // }

  if (email !== undefined) {
    let emptyValidationText = checkEmpty(email, 'email');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      if (!validator.email(email)) {
        return 'Please enter valid email';
      }
    }
  }

  if (phoneNumber !== undefined) {
    let emptyValidationText = checkEmpty(phoneNumber, 'phone number');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(phoneNumber)) {
      return 'Please enter valid mobile number';
    }
  }

  if (otp !== undefined) {
    let emptyValidationText = checkEmpty(otp, 'OTP');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if(emailMobile!==undefined){
  // 	let emptyValidationText = checkEmpty(emailMobile, 'Email or mobile');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	}
  // 	if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(emailMobile)) {
  // 		if (!validator.email(emailMobile)) {
  // 			return 'Please enter valid email or mobile';
  // 		}
  // 	}
  // }

  if (password !== undefined) {
    let emptyValidationText = checkEmpty(password, 'Password');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(password, 6, 'Password');
      if (minLengthValidation !== '') {
        if (password != undefined) {
          return 'Password requires minimum 6 characters';
        }
        return 'Password is incorrect';
      }
    }
  }

  if (newPassword !== undefined) {
    let emptyValidationText = checkEmpty(newPassword, 'New password');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(newPassword, 6, 'New password');
      if (minLengthValidation !== '') {
        if (newPassword != undefined) {
          return 'New Password requires minimum 6 characters';
        }
        return 'New Password is incorrect';
      }
    }
  }

  if (confirmPassword !== undefined) {
    let emptyValidationText = checkEmpty(confirmPassword, 'Confirm Password');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (confirmPassword != newPassword) {
      return "New Password and Confirm Password didn't matched";
    }
  }

  if (message !== undefined) {
    let emptyValidationText = checkEmpty(message, 'message');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 6, 'message');
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }
}
