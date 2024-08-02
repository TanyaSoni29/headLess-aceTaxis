/** @format */
import { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';
import DriverAllocation from '../components/DriverAllocation';
import { useState } from 'react';
import Map from '../components/Map';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '../components/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import SimpleSnackbar from '../components/SnackBar';
import FullScreenDialog from '../components/FullScreenModal';
import Scheduler from './Scheduler';
import { useSelector } from 'react-redux';
import {
	addData,
	endBooking,
	onCreateBooking,
	onUpdateBooking,
	setActiveTabChange,
} from '../context/bookingSlice';

import { useDispatch } from 'react-redux';
import { addCaller } from '../context/callerSlice';
import Pusher from 'pusher-js';
import DispatcherBooking from '../components/Dispatcher/DispatcherBooking';

const pusher = new Pusher('8d1879146140a01d73cf', {
	cluster: 'eu',
});

// subscribing to a channel for caller id
const channel = pusher.subscribe('my-channel');

export default function Push() {
	const data = useSelector((state) => state.bookingForm.bookings);
	const caller = useSelector((state) => state.caller);
	const activeTab = useSelector(
		(state) => state.bookingForm.activeBookingIndex
	);
	const dispatch = useDispatch();
	const [secondaryTab, setSecondaryTab] = useState(1);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const [viewDispatcher, setViewDispatcher] = useState(false);

	const [viewScheduler, setViewScheduler] = useState(false);

	const handleChange = (event, newValue) => {
		// onActiveTabChange(newValue);
		dispatch(setActiveTabChange(newValue));
	};

	const [isBookingSnackBarOpen, setIsBookingSnackBarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	function handleBookingUpload(id = activeTab) {
		const currentBooking = data[id];
		if (currentBooking.bookingType === 'current') {
			dispatch(onUpdateBooking(id)).then((data) => {
				setIsBookingSnackBarOpen(true);
				if (data.status === 'success') {
					setSnackbarMessage('Booking Updated Successfully');
				} else {
					setSnackbarMessage('Failed to Update Booking');
				}
			});
		} else {
			dispatch(onCreateBooking(id)).then((data) => {
				setIsBookingSnackBarOpen(true);
				if (data.status === 'success') {
					setSnackbarMessage(`Booking Created Successfully`);
				} else {
					setSnackbarMessage(`Failed to Create booking`);
				}
			});
		}
	}

	useEffect(() => {
		function handleBind(data) {
			try {
				const parsedData = JSON.parse(data.message);
				const PhoneNumber = parsedData.Telephone;
				if (
					parsedData.Current.length === 0 &&
					parsedData.Previous.length === 0
				) {
					dispatch(addData({ PhoneNumber }));
				} else {
					// setCallerId((prev) => [...prev, parsedData]);
					dispatch(addCaller(parsedData));
				}
			} catch (error) {
				console.error('Failed to parse message data:', error);
			}
		}
		channel.bind('my-event', handleBind);
		return () => {
			channel.unbind('my-event', handleBind);
		};
	}, [dispatch]);

	const handleKeyDown = (event) => {
		if (event.key === 'F2') {
			event.preventDefault();
			setViewScheduler(false);
			setViewDispatcher((prev) => !prev);
		}
		if (event.key === 'F3') {
			event.preventDefault();
			setViewDispatcher(false);
			setViewScheduler((prev) => !prev);
		}
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<Box
			className='flex justify-between'
			sx={{ width: '100%' }}
		>
			<FullScreenDialog
				open={viewDispatcher}
				setOpen={setViewDispatcher}
			>
				<DispatcherBooking />
			</FullScreenDialog>
			<FullScreenDialog
				open={viewScheduler}
				setOpen={setViewScheduler}
			>
				<Scheduler />
			</FullScreenDialog>
			<Modal
				open={isConfirmationModalOpen}
				setIsOpen={setIsConfirmationModalOpen}
			>
				<ConfirmDeleteBookingModal
					deleteBooking={() => {
						dispatch(endBooking());
					}}
					id={activeTab}
					setIsConfirmationModalOpen={setIsConfirmationModalOpen}
				/>
			</Modal>
			<Box
				sx={{
					margin: '1vh auto',
					height: '90vh',
					overflow: 'auto',
					width: '60%',
					borderColor: '#e5e7eb',
					borderWidth: '1px',
				}}
			>
				<Tabs
					value={activeTab}
					sx={{ backgroundColor: '#e5e7eb' }}
					onChange={handleChange}
					variant='scrollable'
					scrollButtons
					allowScrollButtonsMobile
					aria-label='scrollable force tabs example'
				>
					{data.map((item, index) => {
						let label = index === 0 ? 'New Booking' : item.phoneNumber;
						label +=
							item.bookingType === 'Previous'
								? ' (New)'
								: item.bookingType === 'Current'
								? ' (Edit)'
								: '';
						return (
							<Tab
								label={label}
								icon={
									index !== 0 ? (
										<CancelIcon
											color='error'
											onClick={() => {
												setIsConfirmationModalOpen(true);
											}}
										/>
									) : null
								}
								iconPosition='end'
								key={index}
								style={{
									color: item.formBusy ? '#B91C1C' : '',
								}}
							/>
						);
					})}
				</Tabs>
				<Box>
					<Booking
						bookingData={data[activeTab]}
						key={activeTab}
						id={activeTab}
						onBookingUpload={handleBookingUpload}
					/>
					<SimpleSnackbar
						disableReset={true}
						open={isBookingSnackBarOpen}
						setOpen={setIsBookingSnackBarOpen}
						message={snackbarMessage}
					/>
				</Box>
			</Box>
			<Box
				sx={{
					margin: '1vh auto',
					height: '90vh',
					overflow: 'auto',
					width: '40%',
					borderColor: '#e5e7eb',
					borderWidth: '1px',
				}}
			>
				<Tabs
					value={secondaryTab}
					sx={{ backgroundColor: '#e5e7eb' }}
					onChange={(event, newValue) => setSecondaryTab(newValue)}
					variant='scrollable'
					scrollButtons
					allowScrollButtonsMobile
					aria-label='scrollable force tabs example'
				>
					<Tab label='Availability' />
					<Tab label='Map' />
				</Tabs>
				{secondaryTab === 0 && <DriverAllocation />}
				{secondaryTab === 1 && <Map />}
			</Box>
		</Box>
	);
}

function ConfirmDeleteBookingModal({
	setIsConfirmationModalOpen,
	id,
	deleteBooking,
}) {
	const handleClick = () => {
		setIsConfirmationModalOpen(false);
		deleteBooking();
	};
	return (
		<div className='flex flex-col items-center justify-center w-[20vw] bg-white rounded-lg p-4 gap-4'>
			<div className='flex justify-between items-center  bg-cyan-600 text-white w-full rounded-lg p-2'>
				<h2 className='text-xl font-semibold bg-cyan-600 text-white w-full'>
					Discard Booking
				</h2>
				<CloseIcon onClick={() => setIsConfirmationModalOpen(false)} />
			</div>
			<h2>Are you sure you want to delete this booking?</h2>
			<div className='flex justify-center items-center gap-2'>
				<Button
					variant='contained'
					sx={{ backgroundColor: '#0891b2' }}
					onClick={() => handleClick(id)}
				>
					Yes
				</Button>
				<Button
					color='inherit'
					variant='contained'
					onClick={() => setIsConfirmationModalOpen(false)}
				>
					No
				</Button>
			</div>
		</div>
	);
}
