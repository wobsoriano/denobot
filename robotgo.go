// Copyright 2016 The go-vgo Project Developers. See the COPYRIGHT
// file at the top-level directory of this distribution and at
// https://github.com/go-vgo/robotgo/blob/master/LICENSE
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

/*

Package robotgo Go native cross-platform system automation.

Please make sure Golang, GCC is installed correctly before installing RobotGo;

See Requirements:
	https://github.com/go-vgo/robotgo#requirements

Installation:
	go get -u github.com/go-vgo/robotgo

C-shared:
	go get -v github.com/vcaesar/gocs

	gocs -n robotgo
*/

package main

/*
#include <stdlib.h>
#include <string.h>

typedef struct { int x; int y; } Coordinates;
typedef struct { int x; int y; } CaptureScreenReturn;
*/
import "C"

import (
	"fmt"
	"strings"
	"unsafe"

	"github.com/go-vgo/robotgo"
)

func ch(str string) *C.char {
	return C.CString(str)
}

func str(ch *C.char) string {
	return C.GoString(ch)
}

func sf(err error) string {
	return fmt.Sprintf("%s", err)
}

func ech(err error) *C.char {
	return ch(sf(err))
}

func toStr(arr interface{}) string {
	return strings.Trim(fmt.Sprint(arr), "[]")
}

func toCoordinates(x, y int) *C.Coordinates {
	// malloc a new Coordinates struct and set contents
	coords := (*C.Coordinates)(C.malloc(C.size_t(unsafe.Sizeof(C.Coordinates{}))))

	coords.x = (C.int)(x)
	coords.y = (C.int)(y)

	return coords
}

//export FreeString
func FreeString(str *C.char) {
	C.free(unsafe.Pointer(str))
}

//export GetVersion
func GetVersion() *C.char {
	s := robotgo.GetVersion()
	return ch(s)
}

//export Sleep
func Sleep(tm int) {
	robotgo.Sleep(tm)
}

//export MilliSleep
func MilliSleep(tm int) {
	robotgo.MilliSleep(tm)
}

//export MSleep
func MSleep(tm int) {
	robotgo.MilliSleep(tm)
}

/*
      _______.  ______ .______       _______  _______ .__   __.
    /       | /      ||   _  \     |   ____||   ____||  \ |  |
   |   (----`|  ,----'|  |_)  |    |  |__   |  |__   |   \|  |
    \   \    |  |     |      /     |   __|  |   __|  |  . `  |
.----)   |   |  `----.|  |\  \----.|  |____ |  |____ |  |\   |
|_______/     \______|| _| `._____||_______||_______||__| \__|
*/

//export GetPixelColor
func GetPixelColor(x, y int) *C.char {
	s := robotgo.GetPixelColor(x, y)
	return ch(s)
}

//export GetMouseColor
func GetMouseColor() *C.char {
	s := robotgo.GetMouseColor()
	return ch(s)
}

//export GetScreenSize
func GetScreenSize() *C.Coordinates {
	return toCoordinates(robotgo.GetScreenSize())
}

//export GetScaleSize
func GetScaleSize() *C.Coordinates {
	return toCoordinates(robotgo.GetScaleSize())
}

//export CaptureScreen
func CaptureScreen(x, y, w, h int) (*uint8, int, int,
	int, uint8, uint8) {
	var bit robotgo.Bitmap
	if x == -1 {
		bit = robotgo.CaptureGo()
	} else {
		bit = robotgo.CaptureGo(x, y, w, h)
	}

	return bit.ImgBuf, bit.Width, bit.Height,
		bit.Bytewidth, bit.BitsPixel, bit.BytesPerPixel
}

// TODO: export SaveCapture
// func SaveCapture(path *C.char, x, y, w, h int) {
// 	if x == -1 {
// 		robotgo.SaveCapture(str(path))
// 		return
// 	}

// 	robotgo.SaveCapture(str(path), x, y, w, h)
// }

/*
.___  ___.   ______    __    __       _______. _______
|   \/   |  /  __  \  |  |  |  |     /       ||   ____|
|  \  /  | |  |  |  | |  |  |  |    |   (----`|  |__
|  |\/|  | |  |  |  | |  |  |  |     \   \    |   __|
|  |  |  | |  `--'  | |  `--'  | .----)   |   |  |____
|__|  |__|  \______/   \______/  |_______/    |_______|

*/

//export Move
func Move(x, y int) {
	robotgo.Move(x, y)
}

//export DragSmooth
func DragSmooth(x, y int, args *C.char) {
	robotgo.DragSmooth(x, y, str(args))
}

//export MoveSmooth
func MoveSmooth(x, y int, low, high float64) bool {
	return robotgo.MoveSmooth(x, y, low, high)
}

//export GetMousePos
func GetMousePos() *C.Coordinates {
	return toCoordinates(robotgo.GetMousePos())
}

//export Click
func Click(btn *C.char, doublec bool) {
	robotgo.Click(str(btn), doublec)
}

//export Toggle
func Toggle(key, btn *C.char) {
	robotgo.Toggle(str(key), str(btn))
}

//export Scroll
func Scroll(x, y int) {
	robotgo.Scroll(x, y)
}

/*
 __  ___  ___________    ____ .______     ______        ___      .______       _______
|  |/  / |   ____\   \  /   / |   _  \   /  __  \      /   \     |   _  \     |       \
|  '  /  |  |__   \   \/   /  |  |_)  | |  |  |  |    /  ^  \    |  |_)  |    |  .--.  |
|    <   |   __|   \_    _/   |   _  <  |  |  |  |   /  /_\  \   |      /     |  |  |  |
|  .  \  |  |____    |  |     |  |_)  | |  `--'  |  /  _____  \  |  |\  \----.|  '--'  |
|__|\__\ |_______|   |__|     |______/   \______/  /__/     \__\ | _| `._____||_______/

*/

//export KeyTap
func KeyTap(key *C.char, vals *C.char) *C.char {
	arr := strings.Split(str(vals), ",")
	err := robotgo.KeyTap(str(key), arr)
	if err != nil {
		return ch(err.Error())
	}

	return ch("")
}

//export KeyToggle
func KeyToggle(key *C.char, args *C.char) *C.char {
	arr := strings.Split(str(args), ",")
	names := make([]interface{}, len(arr))
	for i, s := range arr {
		names[i] = s
	}
	err := robotgo.KeyToggle(str(key), names...)
	if err != nil {
		return ch(err.Error())
	}

	return ch("")
}

//export TypeStr
func TypeStr(c *C.char, args int) {
	robotgo.TypeStr(str(c), args)
}

//export TypeStrDelay
func TypeStrDelay(c *C.char, delay int) {
	robotgo.TypeStrDelay(str(c), delay)
}

//export ReadAll
func ReadAll() (*C.char, *C.char) {
	s, err := robotgo.ReadAll()
	if err != nil {
		return ch(s), ech(err)
	}

	return ch(s), ch("")
}

func errStr(err error) *C.char {
	if err != nil {
		return ech(err)
	}

	return ch("")
}

//export WriteAll
func WriteAll(text *C.char) *C.char {
	err := robotgo.WriteAll(str(text))
	return errStr(err)
}

//export PasteStr
func PasteStr(text *C.char) {
	robotgo.PasteStr(str(text))
}

// TODO: BITMAP
// TODO: EVENTS

/*
____    __    ____  __  .__   __.  _______   ______   ____    __    ____
\   \  /  \  /   / |  | |  \ |  | |       \ /  __  \  \   \  /  \  /   /
 \   \/    \/   /  |  | |   \|  | |  .--.  |  |  |  |  \   \/    \/   /
  \            /   |  | |  . `  | |  |  |  |  |  |  |   \            /
   \    /\    /    |  | |  |\   | |  '--'  |  `--'  |    \    /\    /
    \__/  \__/     |__| |__| \__| |_______/ \______/      \__/  \__/

*/

//export ShowAlert
func ShowAlert(title, msg *C.char) bool {
	return robotgo.Alert(str(title), str(msg))
}

//export GetTitle
func GetTitle(pid int32) *C.char {
	if pid == -1 {
		title := robotgo.GetTitle()
		return ch(title)
	}

	title := robotgo.GetTitle(pid)
	return ch(title)
}

//export GetBounds
func GetBounds(pid int32) (int, int, int, int) {
	return robotgo.GetBounds(pid)
}

//export PidExists
func PidExists(pid int32) (bool, *C.char) {
	b, err := robotgo.PidExists(pid)
	if err != nil {
		return b, ech(err)
	}

	return b, ch("")
}

//export FindIds
func FindIds(name *C.char) (*C.char, *C.char) {
	arr, err := robotgo.FindIds(str(name))
	sb := toStr(arr)

	if err != nil {
		return ch(sb), ech(err)
	}

	return ch(sb), ch("")
}

//export FindName
func FindName(pid int32) (*C.char, *C.char) {
	sb, err := robotgo.FindName(pid)

	if err != nil {
		return ch(sb), ech(err)
	}

	return ch(sb), ch("")
}

//export FindNames
func FindNames() (*C.char, *C.char) {
	arr, err := robotgo.FindNames()
	sb := toStr(arr)

	if err != nil {
		return ch(sb), ech(err)
	}

	return ch(sb), ch("")
}

//export FindPath
func FindPath(pid int32) (*C.char, *C.char) {
	sb, err := robotgo.FindPath(pid)

	if err != nil {
		return ch(sb), ech(err)
	}

	return ch(sb), ch("")
}

//export ActivePID
func ActivePID(pid int32) (c *C.char) {
	err := robotgo.ActivePID(pid)
	if err != nil {
		c = ech(err)
	}

	return
}

//export ActiveName
func ActiveName(name *C.char) (c *C.char) {
	err := robotgo.ActiveName(str(name))
	if err != nil {
		c = ech(err)
	}

	return
}

//export Kill
func Kill(pid int32) *C.char {
	err := robotgo.Kill(pid)
	return errStr(err)
}

func main() {} // Required but ignored
