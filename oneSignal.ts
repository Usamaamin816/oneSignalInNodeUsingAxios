//first create an configFile in which you have to create an oneSignalConfig object in which we have to add a key values "appId" and "restApiKey" that you will get it from oneSignal Dashboard

//auth.config.ts
export const oneSignalConfig = {
	appId: "3e64c592-*****",
	restApiKey: "MWEyZDQzYmUtNWQz*****"
};

//oneSignal.ts
//also make sure that you have installed axios npm package in your project 

const axios = require("axios");
import { oneSignalConfig } from "../config/auth.config";

export const sendNotification = async (
	email: any,
	sender: any,
	notification: any,
	senderNotification: any,
	oneSignalData: any
) => {
	try {
		const { appId, restApiKey } = oneSignalConfig;
		const recipientNotificationContent = {
			app_id: appId,
			filters: [{ field: "tag", key: "email", relation: "=", value: email }],
			contents: { en: notification.contents.en },
			headings: { en: notification.headings.en },
			data: oneSignalData
			// contents: { en: "you received a map" }
		};
		await sendNotificationToUser(recipientNotificationContent, restApiKey);
		const senderNotificationContent = {
			app_id: appId,
			filters: [{ field: "tag", key: "email", relation: "=", value: sender }],
			contents: { en: senderNotification.contents.en }, // Adjust this as needed
			headings: { en: senderNotification.headings.en } // Adjust this as needed
		};
		await sendNotificationToUser(senderNotificationContent, restApiKey);
	} catch (error) {
		console.error("something went wrong");
	}
};
const sendNotificationToUser = async (
	notificationContent: any,
	restApiKey: string
) => {
	try {
		const response = await axios.post(
			"https://onesignal.com/api/v1/notifications",
			notificationContent,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Basic ${restApiKey}`,
					accept: "application/json"
				}
			}
		);

		console.log("Push notification sent successfully:", response.data);
	} catch (error) {
		console.error("Error sending push notification:", error.response.data);
		throw error; // Propagate the error back to the caller
	}
};


//now export it in anywhere in the project and passed that data that are required for notifications
//export in shareMap.ts 
import { sendNotification } from "../helpers/oneSignal";
const {
					first_name: receiver_first_name,
					last_name: receiver_last_name
				} = receiver;
				const notification = {
					contents: { en: `Map shared by ${first_name} ${last_name}` },
					headings: { en: "You received a share map" }
				};
				const senderNotification = {
					contents: {
						en: `You share a map with ${receiver_first_name} ${receiver_last_name}`
					},
					headings: { en: "You share a share map" }
				};
				// console.log("newShareUser", senderNotification);
				const oneSignalData = {
					module: "home",
					_id: map._id,
					type: "map",
					redirect: true
				};
				const notificationSchema = {
					content: notification.contents.en,
					heading: notification.headings.en,
					receiverEmail: receiverEmail,
					sender: sender,
					notificationRedirect: oneSignalData
				};

