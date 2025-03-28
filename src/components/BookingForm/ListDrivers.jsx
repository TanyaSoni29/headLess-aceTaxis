/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { updateValue } from '../../context/bookingSlice';
import { getAllDrivers } from '../../utils/apiReq';
import Loader from '../Loader';

// Allocate Driver Section Modal It set Driver id with the Active Booking
function ListDrivers({ setOpen }) {
	const dispatch = useDispatch();
	const id = useSelector((state) => state.bookingForm.activeBookingIndex);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	// Fetch all drivers from the API
	useEffect(() => {
		getAllDrivers().then((res) => {
			const driverUsers = [
				{ id: 0, fullName: 'Unallocated', colorRGB: '#795548' },
				...res.users,
			];
			setData(driverUsers);
		});
		setLoading(true);
		setLoading(false);
	}, []);

	// Function to handle the driver selection to global reducer
	function handleAttactDriver(driver) {
		dispatch(updateValue(id, 'userId', driver.id));
		setOpen(false);
	}

	return (
		<div className='bg-gray-100 w-[80vw] sm:w-[25vw] px-2 py-10 rounded'>
			<div className='header flex w-full flex-col gap-5 text-center text-gray-700'>
				<div className=''>
					<p className='text-5xl'>
						<AccountCircleIcon fontSize='35px' />
					</p>
					<p className='m-3 font-bold uppercase'>allocate driver</p>
				</div>
				<div>
					<p className='text-2xl font-bold uppercase'>select driver</p>
				</div>
				<div className='mx-auto w-full h-[50vh] overflow-auto relative'>
					{loading ? (
						<Loader />
					) : (
						data.map((el, idx) => (
							<div
								key={idx}
								className='bg-gray-200 mb-2 cursor-pointer'
								onClick={() => handleAttactDriver(el)}
							>
								<div className='flex mx-auto justify-center items-center align-middle gap-4'>
									<div
										style={{ backgroundColor: el.colorRGB }}
										className={`h-5 w-5`}
									></div>
									<div className='flex flex-col w-[60%] justify-center items-start'>
										<p className='text-[1rem]'>
											({el?.id}) - {el?.fullName}{' '}
											{el?.vehicleType === 0
												? ''
												: el?.vehicleType === 1
												? '(Saloon)'
												: el?.vehicleType === 2
												? '(Estate)'
												: el?.vehicleType === 3
												? '(MPV)'
												: el?.vehicleType === 4
												? '(MPVPlus)'
												: el?.vehicleType === 5
												? '(SUV)'
												: ''}
										</p>
										<p className='text-[.8rem]'>{el.regNo}</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default ListDrivers;
