import sys

print('Python:', sys.version)

for mod in ['playwright', 'selenium', 'cv2', 'PIL', 'imageio']:
    try:
        __import__(mod)
        print(mod, 'AVAILABLE')
    except ImportError:
        print(mod, 'not available')
