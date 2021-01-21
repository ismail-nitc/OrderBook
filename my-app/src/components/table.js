import React from 'react'
import Tabulator from 'tabulator-tables';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
    }
    refreshTable = () => {
        console.log('T Data:',this.props.data)
        const opts = {
            data: this.props.data,
            headerSort: false,
            layout: 'fitColumns',
            responsiveLayout: 'hide',
            tooltips: false,
            addRowPos: 'top',
            history: false,
            pagination: false,
            movableColumns: false,
            resizableRows: false,
            columns: [
                {
                    title: 'Count', field: 'count', headerSort: false, align: 'center'
                },
                {
                    title: "Amount", field: "amount", headerSort: false, align: 'center'
                },
                {
                    title: "Price", field: "price", headerSort: false, align: 'center'
                }
            ],
            placeholder: "No Data Available"
        }

        let table = new Tabulator("#table-orderBook", opts)
        this.props.getTable(table)
    }

    componentDidMount() {
        this.refreshTable()
    }

    render() {
        return (
            < div style={{ height: '100%', width: '80%' }} data-testid="table">
                <div id="table-orderBook"></div>
            </div >
        )
    }

}
