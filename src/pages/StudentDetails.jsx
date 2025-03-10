import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  getCountFromServer,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
// import { debounce } from 'debounce';
import { Table, Select, Input, Spin, Tooltip, DatePicker } from 'antd';
import DummyProfile from '../assets/DummyProfile.svg';
import IconSearch from '../assets/IconSearch.svg';
import NotificationIcon from '../assets/NotificationIcon.svg';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [studentListCount, setStudentListCount] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [firestoreLimit, setFirestoreLimit] = useState(10);

  useEffect(() => {
    const getStudents = async () => {
      const studentRef = collection(db, 'studentGraduationPhotos');

      try {
        let queryStatement;
        queryStatement = query(
          studentRef,
          where('type', 'array-contains', 'PLAYER')
        );
        setLoading(true);
        const snapshot = await getCountFromServer(queryStatement);
        setStudentListCount(snapshot.data().count);

        queryStatement = query(
          studentRef,

          limit(firestoreLimit)
        );

        const userSnapshot = await getDocs(queryStatement);
        if (userSnapshot.docs.length > 0) {
          const userList = userSnapshot.docs.map((doc) =>
            doc.data({ ...doc.data(), ref: doc.ref.path })
          );
          setStudents(userList);
          return userList;
        }
      } catch (e) {
        console.log('Error getting documents', e);
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [firestoreLimit]);
  console.log(students, 'students', studentListCount, 'StudentListCount');
  return (
    <div className="p-14">
      <div>
        <div className="flex justify-between items-center pt-5 pb-10 border-b-2 border-b-[#E9EDF2]  ">
          <div className=" text-[#404D59]  font-mainTextStyle text-[20px] font-custom leading-custom tracking-custom   ">
            All Students
          </div>

          <Input
            prefix={<img src={IconSearch} alt="My icon" />}
            placeholder="Search By Index..."
            className="flex justify-start items-center w-[456px] h-[38px] rounded-[8px] py-2 px-6 max-w-1/4 gap-3 bg-[#F7F9FA] border-none"
            // onSearch={(value) => {
            //   handleSearch(value);
            // }}
            // onChange={(e) => {
            //   handleSearch(e.target.value);
            // }}
          />
          {/* profile */}
          <div className="flex justify-between items-center gap-4">
            <img src={NotificationIcon} alt="My icon" />
            <div className="flex justify-between items-center gap-3">
              <img src={DummyProfile} alt="My icon" />
              <div className="flex flex-col ">
                <h1 class="font-semibold text-[14px] leading-[16px] text-[#000000] font-mainTextStyle">
                  Admin
                </h1>
                <h1 class="font-semibold text-[10px] leading-[16px] text-[#A8B4BF] font-mainTextStyle">
                  admin@admin.com
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* total records and other things */}
      <div className="flex justify-between items-center   border-b-2 border-b-[#E9EDF2] py-6">
        {/* for records */}
        <div className="flex justify-between items-center gap-4">
          <h1 class="font-semibold text-[14px] leading-[16px] text-[#2352D8] font-mainTextStyle">
            Total Records
          </h1>
          <div className=" text-[12px] font-semibold text-white leading-[16px] font-mainTextStyle bg-[#2352D8] w-[29px] h-[25px] rounded-[4px] p-2 gap-2 flex items-center justify-center">
            {studentListCount}
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 ">
          <h1 class="font-semibold text-[12px] leading-[16px] text-[#8B98A6] font-mainTextStyle">
            Filter By:
          </h1>
          <DatePicker />
        </div>
        <div className="flex justify-center items-center gap-4 ">
          <h1 class="font-semibold text-[12px] leading-[16px] text-[#8B98A6] font-mainTextStyle">
            Show Records
          </h1>
          <Select
            style={{ width: 70 }}
            placeholder="Number Of Latest Data"
            // onChange={handleSetLimit}
            defaultValue={firestoreLimit}
            options={[
              {
                value: 10,
                label: 10,
              },
              {
                value: 25,
                label: 25,
              },
              {
                value: 50,
                label: 50,
              },
              {
                value: 100,
                label: 100,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
