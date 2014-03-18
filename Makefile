chromezip:
	mkdir -p build
	cd videovr-chrome; zip -r ../build/videovr-chrome.zip *

clean:
	rm -rf build
