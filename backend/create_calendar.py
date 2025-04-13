from datetime import date, timedelta

def create_calendar(offset = 0) -> list[list[int]]:
    calendar_list = []
    my_date = date.today()
    if offset != 0:
        year = my_date.year
        month = my_date.month + offset
        if month > 12:
            year += 1
            month = (month%12) + 1
        elif month < 1:
            year -= 1
            month = (month%12) + 1
        my_date = date(year, month, 1)
        
    now = my_date.timetuple()
    my_date += timedelta(days = -my_date.day + 1)
    my_date += timedelta(days = -my_date.weekday())
    week = []
    while my_date.month <= now.tm_mon or (my_date.month == 12 and now.tm_mon == 1) or 0 != len(week):
        week.append(my_date.day)
        if len(week) == 7:
            calendar_list.append(week)
            week = []

        my_date += timedelta(days = 1)
        
    return calendar_list