/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useState } from 'react';
import Modal from '../components/Modal';
import EditBookingModal from './CustomDialogButtons/EditBookingModal';
import AllocateModal from './CustomDialogButtons/AllocateModal';
import CompleteBookingModal from './CustomDialogButtons/CompleteBookingModal';
import DeleteBookingModal from './CustomDialogButtons/DeleteBookingModal';
import DuplicateBookingModal from './CustomDialogButtons/DuplicateBookingModal';
import { useSelector } from 'react-redux';

function CustomDialog({ closeDialog }) {
	const [allocateModal, setAllocateModal] = useState(false);
	const [isCompleteBookingModal, setIsCompleteBookingModal] = useState(false);
	const [editBookingModal, setEditBookingModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [duplicateBookingModal, setDuplicateBookingModal] = useState(false);
	const { bookings, currentlySelectedBookingIndex: index } = useSelector(
		(state) => state.scheduler
	);
	const data = bookings[index];

	return (
		<div className='fixed left-[-35vw] inset-0 w-[70vw] mx-auto z-50 flex items-center justify-center p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-7xl p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white'>
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
				<div className='p-5 grid grid-cols-2 place-content-between gap-4 mt-4 border border-card dark:border-popover'>
					<div>
						<div className='flex flex-col w-full gap-4'>
							<div className='border border-card p-4 hover:shadow-lg rounded-lg relative mb-2'>
								<h3 className='text-xl absolute top-[-18px] bg-white text-red-700 flex justify-start items-center font-semibold'>
									Journey
								</h3>
								<div className='flex justify-start items-center gap-10 w-full'>
									{/* <EditRoadIcon sx={{fontSize: "100px" , color : "gray"}} /> */}
									<div>
										<BookingOption
											text={getTodayInEnGbFormat(data.pickupDateTime)}
											head='Booking Date'
										/>
										<BookingOption
											text={`${data.pickupAddress}, ${data.pickupPostCode}`}
											head='Pickup'
										/>
										{data.vias.length > 0 &&
											data.vias.map((via, idx) => (
												<BookingOption
													key={idx}
													head={`Via ${idx + 1}`}
													text={`${via.address}, ${via.postCode}`}
												/>
											))}
										<BookingOption
											text={`${data.destinationAddress}, ${data.destinationPostCode}`}
											head='Destination'
										/>
									</div>
								</div>
							</div>

							<div className='border border-card p-4 hover:shadow-lg relative rounded-lg'>
								<h3 className='text-xl absolute top-[-18px] bg-white text-red-700 flex justify-center items-center font-semibold'>
									Passenger
								</h3>
								<BookingOption
									text={data.passengerName ? data.passengerName : 'NA'}
									head='Passenger Name'
								/>
								<BookingOption
									text={data.email ? data.email : 'NA'}
									head='Email'
								/>
								<BookingOption
									text={data.phoneNumber ? data.phoneNumber : 'NA'}
									head='Phone Number'
								/>
								<BookingOption
									text={data.passengers ? data.passengers : 'NA'}
									head='Passenger Count'
								/>
							</div>
						</div>
					</div>
					<div className='border border-card p-4 hover:shadow-lg rounded-lg relative'>
						<h3 className='text-xl absolute top-[-18px] bg-white text-red-700 flex justify-center items-center font-semibold'>
							Details
						</h3>
						<BookingOption
							text={data.details ? data.details : 'NA'}
							head='Details'
						/>
						<BookingOption
							head='Type'
							text={
								data.scope === 0
									? 'Cash Job'
									: data.scope === 1
									? 'Account'
									: data.scope === 2
									? 'Rank'
									: data.scope === 3
									? 'All'
									: ''
							}
						/>
						{data.scope === 1 && (
							<BookingOption
								text={data.accountNumber ? data.accountNumber : 'NA'}
								head='Account'
							/>
						)}
						<BookingOption
							text={data.fullname || 'NA'}
							head='Allocated Driver'
						/>
						<BookingOption
							text={data.price ? `£${data.price}` : 'NA'}
							head='Price'
						/>
						<div className='flex justify-start items-center gap-4'>
							<BookingOption
								text={
									data.durationMinutes
										? Math.floor(Number(data.durationMinutes) / 60) + ' Hour(s)'
										: 'NA'
								}
								head='Time'
							/>
							<BookingOption
								text={data.mileageText ? data.mileageText : 'NA'}
								head='Distance'
							/>
						</div>
						{data.isAllDay && (
							<BookingOption
								text={data.isAllDay ? '✅' : '❎'}
								head='All Day'
							/>
						)}

						{data.recurrenceID && (
							<BookingOption
								text={data.recurrenceID ? 'Yes' : 'No'}
								head='Repeat Booking'
							/>
						)}
						<div className='flex justify-start items-center gap-4'>
							<BookingOption
								text={
									data.paymentStatus === 0
										? 'Not Paid'
										: data.paymentStatus === 1
										? 'Paid'
										: data.paymentStatus === 2
										? 'Awaiting payment'
										: ''
								}
								head='Payment Status'
							/>
							<BookingOption
								text={
									data.confirmationStatus === 0
										? 'NA'
										: data.confirmationStatus === 1
										? 'Confirmed'
										: data.confirmationStatus
										? 'Not Confirmed'
										: 'NA'
								}
								head='Confirmation Status'
							/>
						</div>
						<div>
							<div className='flex items-center align-middle mb-4'>
								<p className='text-lg font-medium pr-2'>Booked By: </p>
								<span
									className={`text-card dark:text-popover-foreground text-[1rem]`}
								>
									{data.bookedByName}{' '}
									<span className='text-lg font-medium'>On</span>{' '}
									{getTodayInEnGbFormat(data.dateCreated)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-6 gap-4 flex flex-wrap items-center'>
					{/* <BookingButton
						text='View Booking'
						color='blue'
						// onClick={() => setViewBookingModal(true)}
					/> */}

					<BookingButton
						text='Allocate Booking'
						color='blue'
						onClick={() => setAllocateModal(true)}
					/>
					<BookingButton
						onClick={() => setEditBookingModal(true)}
						text='Edit Booking'
						color='blue'
					/>
					<BookingButton
						text='Duplicate Booking'
						color='blue'
						onClick={() => setDuplicateBookingModal(true)}
					/>
					<BookingButton
						text='Driver Arrived'
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
						onClick={() => setDeleteModal(true)}
					/>
				</div>
			</div>
			<Modal
				open={allocateModal}
				setOpen={setAllocateModal}
			>
				<AllocateModal
					setAllocateModal={setAllocateModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={isCompleteBookingModal}
				setOpen={setIsCompleteBookingModal}
			>
				<CompleteBookingModal
					setIsCompleteBookingModal={setIsCompleteBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={editBookingModal}
				setOpen={setEditBookingModal}
			>
				<EditBookingModal
					setEditBookingModal={setEditBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={duplicateBookingModal}
				setOpen={setDuplicateBookingModal}
			>
				<DuplicateBookingModal
					setDuplicateBookingModal={setDuplicateBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={deleteModal}
				setOpen={setDeleteModal}
			>
				<DeleteBookingModal
					setDeleteModal={setDeleteModal}
					closeDialog={closeDialog}
				/>
			</Modal>
		</div>
	);
}

function getTodayInEnGbFormat(date) {
	const today = new Date(date);
	const enGbFormatter = new Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	return enGbFormatter.format(today);
}

const BookingOption = ({ text, head }) => {
	return (
		<div className='flex items-center align-middle mb-1'>
			<p className='text-lg font-medium pr-2'>{head}: </p>
			<span className={`text-card dark:text-popover-foreground text-[1rem]`}>
				{text}
			</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`px-3 py-2 text-white bg-${color}-700 hover:bg-opacity-80 rounded-lg`}
		>
			{text}
		</button>
	);
};

export default CustomDialog;
