---
title: Python Entry Points
date: '2019-07-03T16:51:00.000Z'
layout: post
draft: false
path: '/2019/07/03/python-entry-points/'
category: 'Python'
tags:
  - 'Python'
description: 'A maybe even better way to bootstrap your applications and get a CLI interface.'
---

So I recently wrote a small post on `__main__.py` and got a ton of feedback. Lots of readers were saying to explore Python “entry points” and how they can also act a solution in this space. So that is exactly what I did.

## Our example project: Animals

`animals` will be the sample project we will use to demonstrate how entry points work. The project looks like this:

```
.
├── animals
│   ├── args.py
│   ├── __init__.py
│   ├── __main__.py
│   └── models.py
├── README.md
├── requirements.txt
└── setup.py
```

args.py will handle arguments:

**args.py**

```python
import argparse
parser = argparse.ArgumentParser()
parser.add_argument(
    '-k',
    '--kind',
    help='Pass the kind of animal you want to talk',
    type=str,
    dest='kind',
    default='dog'
)
args = parser.parse_args()
```

models.py will hold some animal classes that have a `talk` function.

**models.py**

```python
class Cat(object):
    def talk(self):
        print('Meow!')

class Dog(object):
    def talk(self):
        print('Woof!')
```

`setup.py` defines our entry points. Entry points allow us to register Interpreter-level objects (typically any Python type that is callable, i.e. classes & functions). When these are registered, The objects are able to be retrieved from any Python module installed. Essentially, they can act as an interface through which we can inject plugins into other modules (More on this later!).

**setup.py**

```python
from setuptools import setup

setup(
    name='animals',
    entry_points={
        'console_scripts': [
            'animals=animals.__main__:main'
        ],
        'animals': [
            'cat=animals.models:Cat',
            'dog=animals.models:Dog',
        ],
    }
)
```

console\_scripts, and animals are our entry points (or registries) in the above setup.py. console\_scripts is especially unique because once we install this module, the callable is available to use in our terminal. i.e.:

```sh
$ pip install -e .
$ animals --kind dog
Woof!
$ animals --kind cat
Meow!
```

This is great. If all you wanted to do was to have a clean console script then entry points has satisfied your requirements. But we can do more!

`__main__.py` is our primary driver and holds our logic.

```python
import pkg_resources
from .args import args

def main():
    animals = {}
    input_animal = args.kind
    for entry_point in pkg_resources.iter_entry_points('animals'):
        animals[entry_point.name] = entry_point.load()

    animal = animals[input_animal]()
    animal.talk()

if __name__ == '__main__':
    main()
```

Console scripts allows us to is to tap into the `__main__.py`‘s main function by way of the line pkg_resources.iter\_entry\_points(‘animals’). Any object that is registered under ‘animals’ will be here. We load them all into the program. We then use our command line arguments to select the one the user wants, and then call it, and have it talk.

```python
animal = animals[input_animal]()
animal.talk()
```

The entry points cat and dog are in setup.py, so we know they are registered. Maybe there are others registered from other modules? This is sounds like a “plugin” to me.

Using Entry Points to Create Plugins
This is where entry points get insanely cool. What if we want to use the animals engine but with another animal besides Dog and Cat? It’s easy. Animals gets its classes from entry points. So it can see any object that’s registered an animals entry point, regardless of what module it belongs to. All we would need to do is register an animal and it would be available instantly. For example, what if we wanted to add the animal Cow? Here’s our cow plugin.

```
.
├── cow-plugin
│   ├── cow.py
│   └── setup.py
cow.py
```

**cow.py**

```python
class Cow(object):
    def talk(self):
        print('Mooooo!')

def main():
    Cow().talk()
setup.py

from setuptools import setup

setup(
    name='cow',
    entry_points={
        'console_scripts': [
            'cow=cow:main'
        ],
        'animals': [
            'cow=cow:Cow',
        ],
    }
)
```

It’s key here that we register our Cow class under the ‘animals’ entry point. Let’s see if it works.

```sh
pip install -e cow-plugin
animals --kind cow
```

Moo!
Woo! We are successfully leveraging the animals engine, but with our Cow class. It’s being loaded dynamically at runtime and the author of animals does not need to make any changes to the engine. It’s a plugin.

Good luck and happy hacking!
