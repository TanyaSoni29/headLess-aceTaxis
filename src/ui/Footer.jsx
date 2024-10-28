/** @format */

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { changeShowDriverAvailability } from '../context/schedulerSlice';

function Footer() {
	const user = useAuth();
	// console.log('User', user);
	const { showDriverAvailability } = useSelector((state) => state.scheduler);
	// const { isActiveTestMode } = useSelector((state) => state.bookingForm);
	// const [notification, setNotification] = useState(false);
	const dispatch = useDispatch();
	const [time, setTime] = useState(new Date().toLocaleTimeString());
	const [date, setDate] = useState(new Date().toDateString());
	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			setTime(now.toLocaleTimeString());
			setDate(now.toDateString());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className='flex flex-col sm:flex-row justify-between h-auto sm:justify-center items-center sm:h-8 w-full fixed bottom-0 bg-[#424242] text-gray-200 uppercase text-sm sm:p-0'>
			<div className='flex flex-col sm:flex-row justify-center gap-2 cursor-pointer mb-2 sm:mb-0 sm:justify-between items-center w-[98%]'>
				<div className='flex justify-start items-center gap-2 cursor-pointer w-full'>
					<span className='text-center sm:text-left'>
						{user.currentUser?.fullName}
					</span>
					<span className='text-center sm:text-left'>
						({user.currentUser?.phoneNumber})
					</span>
				</div>

				<div className='flex sm:flex-row justify-between sm:justify-end sm:items-center items-start text-gray-200 gap-2 cursor-pointer w-full'>
					{/* Availabilty Check Button */}
					<div className='flex justify-center items-center gap-1'>
						<span>Availability</span>
						<input
							type='checkbox'
							checked={showDriverAvailability}
							onChange={() =>
								dispatch(changeShowDriverAvailability(!showDriverAvailability))
							}
						/>
					</div>

					{/* <div className='border border-gray-500 px-1'>F1-Availability</div> */}
					<div className='sm:flex flex-row gap-2'>
						<div className='border border-gray-500 px-1'>F1-Map</div>
						<div className='border border-gray-500 px-1'>F2-Scheduler</div>
						<div className='border border-gray-500 px-1'>F3-Messages</div>
					</div>
					{/* <div
						className={` ${
							isActiveTestMode ? 'text-[#fc3939]' : 'text-green-400'
						} 'border border-gray-500 px-1 cursor-pointer'`}
					>
						Mode: {isActiveTestMode ? 'Test' : 'Live'}
					</div> */}
					<div className='flex flex-col gap-0 justify-center items-end cursor-pointer text-center sm:text-right'>
						<div className='text-[12px]'>{time}</div>
						<div className='mt-[-3px] text-[12px]'>{date}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
