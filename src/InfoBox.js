import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox( { title, cases, total } ) {
    return (
        <Card>
            <CardContent>
                {/* title coronavirys */}
                <Typography className="infobox__title" color="textSecondary">
                    {title}
                </Typography>
                {/*120 k number of cases  */}
                <h2 className="infobox__cases">{cases}</h2>
                {/* 1.2 million total */}
                <Typography  classNaem="infobox__total" color="textSecondary">
                 {total} Total</Typography>
            </CardContent>               
        </Card>
    )
}

export default InfoBox
