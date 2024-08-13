/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Switch } from '@mui/material';
import { useState } from 'react';

import CallIcon from '@mui/icons-material/Call';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTestMode } from '../context/bookingSlice';
import {
	handleSearchBooking,
	makeSearchInactive,
} from '../context/schedulerSlice';
import CancelIcon from '@mui/icons-material/Cancel';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, logout } = useAuth();
	const dispatch = useDispatch();
	const activeTestMode = useSelector(
		(state) => state.bookingForm.isActiveTestMode
	);
	const callerId = useSelector((state) => state.caller);
	const [openSearchInput, setOpenSearchInput] = useState(false);
	const [inputData, SetInputData] = useState('');

	const handleClick = async (e) => {
		e.preventDefault();
		setOpenSearchInput(true);
		if (inputData.length < 3) return;
		dispatch(handleSearchBooking(inputData));
	};

	return (
		<nav className='sticky top-0 z-50 flex justify-between items-center bg-[#424242] text-white p-4'>
			<span className='flex gap-10'>
				<Link
					to='/pusher'
					className='text-lg font-bold uppercase'
				>
					create
				</Link>
			</span>

			<span className='flex gap-10'>
				{!isAuth ? (
					<></>
				) : (
					<div className='flex flex-row items-center align-middle gap-8'>
						{callerId.length > 0 && (
							<Badge
								badgeContent={callerId.length}
								color='error'
								className='cursor-pointer select-none animate-bounce'
							>
								<CallIcon />
							</Badge>
						)}

						<div className='flex justify-center items-center gap-4'>
							{openSearchInput && (
								<div className='relative'>
									<input
										className='rounded-lg w-64 focus:outline-none focus:ring-0 p-1 px-2 text-black bg-gray-200'
										placeholder='Search Bookings...'
										value={inputData}
										onChange={(e) => SetInputData(e.target.value)}
									/>
									<span className='absolute top-auto right-1 cursor-pointer'>
										<CancelIcon
											onClick={() => {
												dispatch(makeSearchInactive());
												SetInputData('');
												setOpenSearchInput(false);
											}}
											fontSize='small'
											color='error'
										/>
									</span>
								</div>
							)}

							<span
								className='cursor-pointer'
								onClick={handleClick}
							>
								Search
							</span>
						</div>
						<span className='flex flex-row gap-2 items-center align-middle'>
							<span>Test Mode</span>
							<Switch
								checked={activeTestMode}
								onChange={(e) => {
									dispatch(setActiveTestMode(e.target.checked));
								}}
							/>
						</span>
						<button
							className='bg-blue-500 text-white px-4 py-2 rounded-lg'
							onClick={() => {
								logout();
								navigate('/login');
							}}
						>
							logout
						</button>
					</div>
				)}
			</span>
		</nav>
	);
};

export default Navbar;
