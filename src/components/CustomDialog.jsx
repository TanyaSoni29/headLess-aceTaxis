/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Button } from '@mui/material';
import { allocateDriver, getAllDrivers } from '../utils/apiReq';
import { useAuth } from '../hooks/useAuth';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import CurrencyPoundOutlinedIcon from '@mui/icons-material/CurrencyPoundOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { completeBookings } from '../utils/apiReq';
import { openSnackbar } from '../context/snackbarSlice';
import { useDispatch } from 'react-redux';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

function CustomDialog({
	closeDialog,
	data,
	onDeleteBooking,
	setViewBookingModal,
}) {
	const { insertData } = useBooking();
	const [allocateModal, setAllocateModal] = useState(false);
	const [isCompleteBookingModal, setIsCompleteBookingModal] = useState(false);
	console.log(data);
	return (
		<div className='fixed left-[-20vw] inset-0 w-[40vw] z-50 flex items-center justify-center p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-3xl p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-lg font-medium text-card'>
						BookingId:{' '}
						<span className='text-xl font-semibold text-green-900'>
							{data.bookingId}
						</span>
					</h2>

					<button
						className='rounded-full p-2'
						onClick={closeDialog}
					>
						<CancelRoundedIcon />
					</button>
				</div>
				<div className='p-4 grid grid-cols-2 place-content-between mt-4 border border-card dark:border-popover'>
					<div>
						<BookingOption
							Icon={AccountBalanceRoundedIcon}
							text={data.accountNumber ? 'Account Job' : 'Cash Job'}
						/>
						{data.scope > 0 && (
							<BookingOption
								text={data.scope}
								Icon={AccountBalanceRoundedIcon}
							/>
						)}
						{data.account && (
							<BookingOption
								text={data.account}
								Icon={AccountBalanceRoundedIcon}
							/>
						)}

						<BookingOption
							Icon={AccountCircleRoundedIcon}
							text={data.fullname || 'No Name'}
						/>

						<div>
							<BookingOption
								Icon={HomeRoundedIcon}
								text={data.pickupAddress}
							/>
							{data.vias.length > 0 && (
								<ul>
									<BookingOption
										Icon={DirectionsOutlinedIcon}
										text={data.vias.map((via) => (
											<li>{via.address}</li>
										))}
									/>
								</ul>
							)}
							<BookingOption
								Icon={PersonPinCircleOutlinedIcon}
								text={data.destinationAddress}
							/>
						</div>
					</div>
					<div>
						<BookingOption
							Icon={CurrencyPoundOutlinedIcon}
							text={data.price}
						/>
						<BookingOption
							Icon={AccessTimeOutlinedIcon}
							text={Math.floor(Number(data.durationText) / 60) + ' Hour(s)'}
						/>
						<BookingOption
							Icon={RouteOutlinedIcon}
							text={data.mileageText}
						/>
						<div>
							<BookingOption
								Icon={AccountCircleRoundedIcon}
								text={data.passengerName}
							/>
							<BookingOption
								Icon={GroupAddIcon}
								text={data.passengers}
							/>
						</div>
						<BookingOption
							Icon={AccountCircleRoundedIcon}
							text={data.bookedByName}
						/>
						<BookingOption
							Icon={DateRangeOutlinedIcon}
							text={data.dateCreated.split('T')[0]}
						/>
					</div>
				</div>
				<div className='mt-6 gap-4 flex flex-wrap items-center'>
					<BookingButton
						text='View Booking'
						color='blue'
						onClick={() => setViewBookingModal(true)}
					/>

					<BookingButton
						text='Allocate Booking'
						color='blue'
						onClick={() => setAllocateModal(true)}
					/>
					<BookingButton
						onClick={() => insertData(data)}
						text='Edit Booking'
						color='blue'
					/>
					<BookingButton
						text='Duplicate Booking'
						color='blue'
					/>
					<BookingButton
						text='Complete Booking'
						color='green'
						onClick={() => setIsCompleteBookingModal(true)}
					/>
					<BookingButton
						text='Cancel Booking'
						color='red'
						onClick={() => onDeleteBooking(data.bookingId)}
					/>
				</div>
			</div>
			<Modal
				open={allocateModal}
				setOpen={setAllocateModal}
			>
				<AllocateModal
					setAllocateModal={setAllocateModal}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={isCompleteBookingModal}
				setOpen={setIsCompleteBookingModal}
			>
				<CompleteBookingModal
					setIsCompleteBookingModal={setIsCompleteBookingModal}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
		</div>
	);
}

const BookingOption = ({ text, Icon }) => {
	return (
		<div className='flex items-start align-middle mb-4'>
			<Icon />
			<span className={`text-card dark:text-popover-foreground`}>{text}</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`px-4 py-4 text-white bg-${color}-700 hover:bg-${color}-600 `}
		>
			{text}
		</button>
	);
};

export default CustomDialog;

// Allocate Driver Modal Structure
function AllocateModal({ setAllocateModal, closeDialog, data }) {
	// console.log(data)
	const [loading, setLoading] = useState(false);
	const [driverData, setDriverData] = useState([]);
	const [bookingData, setBookingData] = useState({});
	const [confirmAllocation, setConfirmAllocation] = useState(false);
	const [selectedDriver, setSelectedDriver] = useState(null);
	useEffect(() => {
		getAllDrivers().then((res) => {
			setDriverData(res.users.filter((user) => user.roleString !== 'Admin'));
		});
		setLoading(true);
		setLoading(false);
	}, []);

	function handleAttactDriver(driver) {
		setConfirmAllocation(true);
		setSelectedDriver(driver);
		setBookingData(data);
	}

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
			<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
				<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
			</div>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium '>Allocate Booking</p>
				</div>
				<div className='bg-[#16A34A] text-center font-medium text-white py-2 px-4 w-full rounded-sm'>
					<p>Gillingham station -- Guys Marsh</p>
				</div>

				<div className='w-full flex justify-center items-center border-b-gray-300 border-b-[1px] p-1'>
					<p>Select Driver</p>
				</div>
				<Modal
					open={confirmAllocation}
					setOpen={setConfirmAllocation}
				>
					<ConfirmAllocationModal
						driver={selectedDriver}
						bookingData={bookingData}
						setAllocateModal={setAllocateModal}
						closeDialog={closeDialog}
						setConfirmAllocation={setConfirmAllocation}
					/>
				</Modal>
				<div className='m-auto w-full h-[50vh] overflow-auto'>
					{loading ? (
						<Loader />
					) : (
						driverData.map((el, idx) => (
							<>
								<div
									key={idx}
									className='bg-gray-200 flex justify-center w-full items-center mx-auto cursor-pointer gap-4 mb-2'
								>
									<div
										className='w-full mx-auto flex justify-center items-center'
										onClick={() => handleAttactDriver(el)}
									>
										<div
											style={{ backgroundColor: el.colorRGB }}
											className={`h-5 w-5 rounded-full`}
										></div>
										<div className='flex flex-col w-[50%] justify-center items-center'>
											<p className='text-xl'>{el?.fullName}</p>
											<p className='text-[.8rem]'>{el.regNo}</p>
										</div>
									</div>
								</div>
							</>
						))
					)}
				</div>

				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setAllocateModal(false)}
				>
					Back
				</Button>
			</div>
		</div>
	);
}

// Confirm Allocation Modal Structure

function ConfirmAllocationModal({
	setAllocateModal,
	closeDialog,
	driver,
	bookingData,
	setConfirmAllocation,
}) {
	const dispatch = useDispatch();
	const user = useAuth();
	const handleConfirmClick = async (driver) => {
		const newAllocationData = {
			bookingId: bookingData.bookingId,
			userId: driver.id,
			actionByUserId: user.currentUser.id,
		};
		// console.log("driver", driver);
		const res = await allocateDriver(newAllocationData);
		setConfirmAllocation(false);
		setAllocateModal(false);
		closeDialog();
		if (res.status === 'success') {
			dispatch(openSnackbar('Driver Allocated Successfully', 'success'));
		}
	};
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Confirm Driver Allocation</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Are you sure you wish to select {driver.fullName} as the driver?
			</div>
			<div className='w-full flex items-center justify-center gap-4'>
				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setConfirmAllocation(false)}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => handleConfirmClick(driver)}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}

// Complete Booking Modal Structure

function CompleteBookingModal({
	setIsCompleteBookingModal,
	closeDialog,
	data,
}) {
	const dispatch = useDispatch();
	const user = useAuth();
	const handleCompleteClick = async (e) => {
		console.log('clicked clicked');
		e.preventDefault();
		const completedBookingData = {
			bookingId: data.bookingId,
			waitingTime: data.waitingTimeMinutes,
			parkingCharge: data.parkingCharge,
			driverPrice: data.price,
			accountPrice: data.priceAccount,
		};
		// console.log("completedBookingData", completedBookingData);
		const response = await completeBookings(completedBookingData);
		setIsCompleteBookingModal(false);
		closeDialog();
		if (response.status === 'success') {
			dispatch(openSnackbar('Booking Completed', 'success'));
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<HelpOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-2xl '>Job completion</p>
				</div>
				<form
					onSubmit={handleCompleteClick}
					className='w-full flex flex-col justify-center items-center gap-3 mt-2'
				>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label>Waiting Time Minutes</label>
						<input
							type='number'
							min='0'
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i className='absolute left-4 top-10 text-black'>
							<AccessTimeOutlinedIcon fontSize='12px' />
						</i>
					</div>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label>Parking Charge</label>
						<input
							type='number'
							min='0'
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i className='absolute left-4 top-10 text-black'>
							<CurrencyPoundOutlinedIcon fontSize='12px' />
						</i>
					</div>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label className=''>
							Price <span className='text-red-600'>*</span>
						</label>
						<input
							required
							type='number'
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i class=' absolute left-4 top-10  text-black'>
							<CurrencyPoundOutlinedIcon fontSize='12px' />
						</i>
					</div>
					{data.priceAccount > 0 && (
						<div className='w-full relative flex flex-col justify-center items-start gap-2'>
							<label className=''>Account Price</label>
							<input
								type='number'
								className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
								placeholder='0'
							/>
							<i class='absolute left-4 top-10  text-black'>
								<CurrencyPoundOutlinedIcon fontSize='12px' />
							</i>
						</div>
					)}
					<Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						type='submit'
					>
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
}
