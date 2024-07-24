const Pagination = ({ className, pageIndex, setPageIndex, totalPagesState }) => {
    return (
        <div className={className}>
            <button onClick={ () => setPageIndex(index => index-1) } disabled={pageIndex === 1} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Anterior</button>
            {
            pageIndex !== 1 && <button onClick={ () => setPageIndex(1) } className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">1</button>
            }
            { pageIndex !== 2 && pageIndex !== 1 && <button onClick={ () => setPageIndex(index => index-1) } className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ pageIndex-1 }</button>}
            <button className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ pageIndex }</button>
            { pageIndex !== totalPagesState && pageIndex !== totalPagesState-1 && <button onClick={ () => setPageIndex(index => index+1) } className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ pageIndex+1 }</button> }
            {
            pageIndex !== totalPagesState && totalPagesState !== 0 && <button onClick={ () => setPageIndex(totalPagesState) } className="lex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ totalPagesState }</button>
            }
            <button onClick={ () => setPageIndex(index => index+1) } disabled={pageIndex === totalPagesState || totalPagesState == 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Siguiente</button>
        </div>
    )
}

export default Pagination
