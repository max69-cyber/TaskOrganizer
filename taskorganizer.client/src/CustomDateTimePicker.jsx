import React from 'react';
import DatePicker from 'react-datepicker';
import { Input, Box, useColorModeValue, Text } from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

const CustomDateTimePicker = ({ selected, onChange }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const headerBg = useColorModeValue('gray.50', 'gray.700');
    const dayHoverBg = useColorModeValue('gray.100', 'gray.600');
    const selectedDayBg = useColorModeValue('gray.100', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');
    const timeBg = useColorModeValue('white', 'gray.700');

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    return (
        <Box sx={{
            '.react-datepicker': {
                fontFamily: 'inherit',
                borderColor: borderColor,
                borderRadius: 'md',
                bg: bgColor,
                color: textColor,
                display: 'flex'
            },
            '.react-datepicker__header': {
                bg: headerBg,
                borderColor: borderColor,
            },
            '.react-datepicker__current-month, .react-datepicker__day-name': {
                color: textColor,
            },
            '.react-datepicker__day': {
                color: textColor,
                '&:hover': {
                    bg: dayHoverBg,
                },
            },
            '.react-datepicker__day--selected': {
                bg: selectedDayBg,
                color: textColor,
            },
            '.react-datepicker__time-container': {
                borderLeft: `1px solid ${borderColor}`,
            },
            '.react-datepicker__time': {
                color: textColor,
                bg: timeBg,
            },
            '.react-datepicker__time-list-item': {
                color: textColor,
                '&:hover': {
                    bg: dayHoverBg,
                },
            },
            '.react-datepicker__time-list-item--selected': {
                bg: selectedDayBg,
                color: 'gray.600',
            },
            '.react-datepicker__time-list': {
            height: 'calc(195px + (1.7rem / 2)) !important'
            },
            '.react-datepicker__time-header': {
                color: textColor,
            },
            '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item': {
                color: textColor,
                '&:hover': {
                    background: dayHoverBg,
                },
            },
            '.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected': {
                background: selectedDayBg,
                color: textColor,
                '&:hover': {
                    background: selectedDayBg,
                }
            }
        }}>
            <DatePicker
                selected={selected}
                onChange={onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="d MMMM yyyy, HH:mm"
                customInput={
                    <Input
                        width="100%"
                        focusBorderColor="teal.500"
                        placeholder="Выберите дату и время"
                    />
                }
                locale={ru}
                months={months}
                dayNames={days}
                timeCaption="Время"
                previousMonthButtonLabel="◄"
                nextMonthButtonLabel="►"
                renderCustomHeader={({
                                         date,
                                         decreaseMonth,
                                         increaseMonth,
                                         prevMonthButtonDisabled,
                                         nextMonthButtonDisabled,
                                     }) => (
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={2}
                        bg={headerBg}
                    >
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '16px',
                                cursor: 'pointer',
                                color: textColor,
                            }}
                        >
                            ◄
                        </button>
                        <Text fontWeight="bold">
                            {months[date.getMonth()]} {date.getFullYear()}
                        </Text>
                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '16px',
                                cursor: 'pointer',
                                color: textColor,
                            }}
                        >
                            ►
                        </button>
                    </Box>
                )}
            />
        </Box>
    );
};

export default CustomDateTimePicker;