const meta = 'data:text/csv;charset=utf-8,'

// const testData = '1,2,3,4,5\n6,7,8,9,0'

export default data => meta + encodeURIComponent(data)
