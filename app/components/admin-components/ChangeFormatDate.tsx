"use client";

const gregorian_to_jalali = (gy, gm, gd) => {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
};

const ChangeFormatDate = (raw_date) => {
  var temp_date = raw_date;
  if (temp_date) {
    var temp_date = temp_date.split("T");
    var date_splited = temp_date[0].split("-");
    var gy = date_splited[0];
    var gm = date_splited[1];
    var gd = date_splited[2];
    var date_merged = gregorian_to_jalali(
      parseInt(gy),
      parseInt(gm),
      parseInt(gd)
    );
    var result = date_merged[0] + "-" + date_merged[1] + "-" + date_merged[2];

    return result;
  }
  return false;
};

export default ChangeFormatDate;
