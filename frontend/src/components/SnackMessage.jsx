import { Typography, Card, Box } from "@mui/joy";

export default function({color, sx, endDecorator, ...props}) {
    return (
        <Card
            sx={{
                width: 0.5,
                maxWidth:350,
                ...sx
            }}
            color={color}
            variant="soft"
        >
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography sx={{width:1}} color={color} variant="soft">{props.children} </Typography>
                {endDecorator}
            </Box>
        </Card>
    );
}