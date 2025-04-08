import {useEffect, useState} from "react";

const usePagination = <T>(countPerPage: number) => {
    // state: 전체 객체 리스트 상태 (호출하는 위치에서 state 결정 - 댓글, 게시물 등등)
    const [totalList, setTotalList] = useState<T[]>([]);
    // state: 보여줄 객체 리스트 상태
    const [viewList, setViewList] = useState<T[]>([]);
    // state: 현재 페이지 번호 상태
    const [currentPage, setCurrentPage] = useState<number>(1);

    // state: 전체 페이지 번호 리스트 상태
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    // state: 보여줄 페이지 번호 리스트 상태
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    // state: 현재 섹션 상태
    const [currentSection, setCurrentSection] = useState<number>(1);

    // state: 전체 섹션 상태
    const [totalSection, setTotalSection] = useState<number>(1);

    // function: 보여줄 객체 리스트 추출 함수
    const setView = () => {
        const start_index = (currentPage - 1) * countPerPage;
        const end_index = start_index + countPerPage > totalList.length ? totalList.length : start_index + countPerPage;
        const viewList = totalList.slice(start_index,end_index);
        setViewList(viewList);
    };

    // function: 보여줄 페이지 리스트 추출 함수
    const setViewPage = () => {
        const start_index = (currentSection - 1) * 10;
        const end_index = currentSection + 10 > totalPageList.length ? totalPageList.length : currentSection + 10;
        const viewPageList = totalPageList.slice(start_index,end_index);
        setViewPageList(viewPageList);
    };

    // effect: total list가 변경될 때마다 진행 작업
    useEffect(() => {

        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalPageList: number[] = [];
        for (let page = 1; page <= totalPage; page++) {
            totalPageList.push(page);
        }
        setTotalPageList(totalPageList);

        const totalSection = Math.ceil(totalPage / (10 * 5));
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();

    }, [totalList]);

    // effect: currentPage가 변경될 때마다 진행 작업
    useEffect(setView,[currentPage]);
    // effect: currentSection이 변경될 때마다 진행 작업
    useEffect(setViewPage,[currentSection]);


    return {
        viewList,
        currentPage,
        setCurrentPage,
        viewPageList,
        currentSection,
        setCurrentSection,
        totalSection,
        setTotalList,
    };
};

export default usePagination;