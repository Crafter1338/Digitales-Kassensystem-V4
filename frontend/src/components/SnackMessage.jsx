import { Typography, Card, Box } from "@mui/joy";

export default function({color, sx, decorator, ...props}) {
    return (
        <Card
            sx={{
                width: 0.65,
                maxWidth:400,
                ...sx
            }}
            color={color}
            variant="soft"
        >
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography sx={{width:1}} color={color} variant="soft">{props.children} </Typography>
                {decorator}
            </Box>
        </Card>
    );
}